from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.deps import require_client
from core.security import create_access_token, verify_password
from core.websocket import worker_manager
from models.order import Order
from models.user import User, UserRole
from schemas.auth import LoginRequest, TokenResponse
from schemas.catalog import OrderCreateFull, OrderOutFull
from schemas.client_profile import ClientProfileOut, ClientProfileUpdate, ClientRegisterRequest
from services import client_service, order_service

router = APIRouter(prefix="/client", tags=["client"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_client(
    payload: ClientRegisterRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenResponse:
    user, token = await client_service.register_client(db, payload)
    return TokenResponse(access_token=token, role=user.role)


@router.post("/login", response_model=TokenResponse)
async def login_client(
    payload: LoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenResponse:
    username = client_service.normalize_phone(payload.username)
    result = await db.execute(
        select(User).where(User.username == username, User.role == UserRole.CLIENT)
    )
    user = result.scalar_one_or_none()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Невірний телефон або пароль")
    token = create_access_token(subject=user.username, role=user.role.value)
    return TokenResponse(access_token=token, role=user.role)


@router.get("/profile", response_model=ClientProfileOut)
async def get_profile(
    current_user: Annotated[User, Depends(require_client)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ClientProfileOut:
    return await client_service.profile_to_out(db, current_user)


@router.put("/profile", response_model=ClientProfileOut)
async def update_profile(
    payload: ClientProfileUpdate,
    current_user: Annotated[User, Depends(require_client)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ClientProfileOut:
    return await client_service.update_client_profile(db, current_user, payload)


@router.get("/orders", response_model=list[OrderOutFull])
async def list_my_orders(
    current_user: Annotated[User, Depends(require_client)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[OrderOutFull]:
    result = await db.execute(
        select(Order)
        .where(Order.client_id == current_user.id)
        .order_by(Order.created_at_ms.desc())
        .limit(50)
    )
    orders = result.scalars().all()
    out = []
    for order in orders:
        out.append(await order_service.get_order_out(db, order.id))
    return out


@router.post("/orders", response_model=OrderOutFull, status_code=201)
async def create_order(
    payload: OrderCreateFull,
    current_user: Annotated[User, Depends(require_client)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> OrderOutFull:
    if payload.use_bonus:
        calc = await order_service._calculate_order(db, payload)
        await client_service.ensure_bonus_available(db, current_user, calc["subtotal"])

    order_out = await order_service.create_order(db, payload)
    order_row = await db.get(Order, order_out.id)
    if order_row:
        order_row.client_id = current_user.id
        if payload.customer_name.strip():
            current_user.display_name = payload.customer_name.strip()
        if payload.customer_phone.strip():
            digits = client_service.normalize_phone(payload.customer_phone)
            current_user.phone = client_service.format_phone(digits)
        if payload.use_bonus:
            await client_service.spend_bonus_points(db, current_user)
        await db.flush()
    await worker_manager.broadcast_new_order(order_out.model_dump(by_alias=True))
    return order_out