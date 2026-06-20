from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.deps import require_client
from core.websocket import worker_manager
from models.order import Order
from models.user import User
from schemas.catalog import OrderCreateFull, OrderOutFull
from services import order_service

router = APIRouter(prefix="/client", tags=["client"])


@router.get("/orders", response_model=list[OrderOutFull])
async def list_my_orders(
    current_user: Annotated[User, Depends(require_client)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[OrderOutFull]:
    result = await db.execute(
        select(Order).where(Order.client_id == current_user.id).order_by(Order.created_at_ms.desc())
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
    order_out = await order_service.create_order(db, payload)
    order_row = await db.get(Order, order_out.id)
    if order_row:
        order_row.client_id = current_user.id
        await db.flush()
    await worker_manager.broadcast_new_order(order_out.model_dump(by_alias=True))
    return order_out