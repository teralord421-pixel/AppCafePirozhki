from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import create_access_token
from models.user import User, UserRole
from schemas.catalog import LegacyRole, PinLoginRequest, PinLoginResponse

ROLE_LABELS: dict[LegacyRole, str] = {
    "customer": "Клієнт",
    "worker": "Працівник",
    "admin": "Адміністратор",
}

PIN_CREDENTIALS: dict[str, tuple[str, str]] = {
    "worker": ("worker1", "2222"),
    "admin": ("admin", "9999"),
}

PASSWORD_FALLBACK: dict[str, str] = {
    "worker": "worker123",
    "admin": "admin123",
}


async def pin_login(payload: PinLoginRequest, db: AsyncSession) -> PinLoginResponse:
    if payload.role == "customer":
        raise HTTPException(status_code=400, detail="Клієнт не потребує PIN")

    creds = PIN_CREDENTIALS.get(payload.role)
    if not creds:
        raise HTTPException(status_code=400, detail="Невідома роль")

    username, expected_pin = creds
    pin = payload.pin.strip()
    if pin not in {expected_pin, PASSWORD_FALLBACK[payload.role]}:
        raise HTTPException(status_code=401, detail="Невірний PIN")

    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=401, detail="Користувача не знайдено")

    token = create_access_token(subject=user.username, role=payload.role)
    return PinLoginResponse(token=token, role=payload.role, label=ROLE_LABELS[payload.role])


def resolve_legacy_role(authorization: str | None) -> LegacyRole | None:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    from core.security import safe_decode_token

    payload = safe_decode_token(authorization.removeprefix("Bearer ").strip())
    if not payload:
        return None
    role = payload.get("role")
    if role in {"customer", "worker", "admin"}:
        return role
    if role == UserRole.CLIENT.value:
        return "customer"
    if role == UserRole.WORKER.value:
        return "worker"
    if role == UserRole.ADMIN.value:
        return "admin"
    return None


def require_legacy_role(*allowed: LegacyRole):
    async def dependency(
        authorization: Annotated[str | None, Header()] = None,
    ) -> LegacyRole:
        role = resolve_legacy_role(authorization)
        if role is None:
            raise HTTPException(status_code=401, detail="Потрібна авторизація")
        if role not in allowed:
            raise HTTPException(status_code=403, detail="Недостатньо прав")
        return role

    return dependency