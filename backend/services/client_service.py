import re

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import create_access_token, hash_password
from models.order import Order
from models.user import User, UserRole
from schemas.client_profile import ClientLoyaltyOut, ClientProfileOut, ClientProfileUpdate, ClientRegisterRequest


def normalize_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)
    if len(digits) < 10 or len(digits) > 13:
        raise HTTPException(status_code=422, detail="Некоректний телефон")
    return digits


def format_phone(digits: str) -> str:
    if digits.startswith("380") and len(digits) == 12:
        return f"+{digits}"
    if len(digits) == 10:
        return f"+38{digits}"
    return f"+{digits}"


async def _total_spent(db: AsyncSession, user_id: int) -> int:
    result = await db.execute(select(func.coalesce(func.sum(Order.total), 0)).where(Order.client_id == user_id))
    return int(result.scalar_one())


def build_loyalty(total_spent: int, spent_points: int) -> ClientLoyaltyOut:
    earned_points = int(total_spent * 0.05)
    points = max(0, earned_points - spent_points)
    return ClientLoyaltyOut(
        spentPoints=spent_points,
        totalSpent=total_spent,
        earnedPoints=earned_points,
        points=points,
    )


async def profile_to_out(db: AsyncSession, user: User) -> ClientProfileOut:
    total_spent = await _total_spent(db, user.id)
    return ClientProfileOut(
        id=user.id,
        username=user.username,
        displayName=user.display_name or "",
        phone=user.phone or "",
        birthday=user.birthday or "",
        favorites=list(user.favorites or []),
        loyalty=build_loyalty(total_spent, user.loyalty_spent_points),
    )


async def register_client(db: AsyncSession, payload: ClientRegisterRequest) -> tuple[User, str]:
    digits = normalize_phone(payload.phone)
    existing = await db.execute(select(User).where(User.username == digits))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Користувач з таким телефоном вже існує")

    user = User(
        username=digits,
        password_hash=hash_password(payload.password),
        role=UserRole.CLIENT,
        display_name=payload.name.strip(),
        phone=format_phone(digits),
        birthday=payload.birthday.strip(),
        favorites=[],
        loyalty_spent_points=0,
    )
    db.add(user)
    await db.flush()
    token = create_access_token(subject=user.username, role=user.role.value)
    return user, token


async def update_client_profile(
    db: AsyncSession, user: User, payload: ClientProfileUpdate
) -> ClientProfileOut:
    if payload.name is not None:
        user.display_name = payload.name.strip()
    if payload.phone is not None:
        digits = normalize_phone(payload.phone)
        user.phone = format_phone(digits)
    if payload.birthday is not None:
        user.birthday = payload.birthday.strip()
    if payload.favorites is not None:
        user.favorites = list(dict.fromkeys(payload.favorites))
    await db.flush()
    return await profile_to_out(db, user)


async def ensure_bonus_available(db: AsyncSession, user: User, subtotal: int) -> None:
    if subtotal < 100:
        raise HTTPException(status_code=422, detail="Бонус працює від 100 грн")
    total_spent = await _total_spent(db, user.id)
    loyalty = build_loyalty(total_spent, user.loyalty_spent_points)
    if loyalty.points < 100:
        raise HTTPException(status_code=422, detail="Недостатньо балів лояльності")


async def spend_bonus_points(db: AsyncSession, user: User) -> None:
    user.loyalty_spent_points += 100
    await db.flush()