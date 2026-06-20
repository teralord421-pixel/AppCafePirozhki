from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.legacy_auth import require_legacy_role
from core.websocket import worker_manager
from schemas.catalog import LegacyRole, OrderCreateFull, OrderOutFull, OrderStatusUpdate
from services import order_service

router = APIRouter(tags=["orders"])


@router.post("/orders", response_model=OrderOutFull, status_code=201)
async def place_order(payload: OrderCreateFull, db: AsyncSession = Depends(get_db)) -> OrderOutFull:
    order = await order_service.create_order(db, payload)
    await worker_manager.broadcast_new_order(order.model_dump(by_alias=True))
    return order


@router.get("/orders", response_model=list[OrderOutFull])
async def orders(
    _: Annotated[LegacyRole, Depends(require_legacy_role("worker", "admin"))],
    db: AsyncSession = Depends(get_db),
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
) -> list[OrderOutFull]:
    return await order_service.list_orders(db, limit=limit)


@router.get("/orders/{order_id}", response_model=OrderOutFull)
async def order(order_id: str, db: AsyncSession = Depends(get_db)) -> OrderOutFull:
    return await order_service.get_order_out(db, order_id)


@router.patch("/orders/{order_id}/status", response_model=OrderOutFull)
async def patch_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    _: Annotated[LegacyRole, Depends(require_legacy_role("worker", "admin"))],
    db: AsyncSession = Depends(get_db),
) -> OrderOutFull:
    return await order_service.update_order_status(db, order_id, payload)