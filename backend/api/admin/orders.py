from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.deps import require_admin
from models.order import Order, OrderStatus, OrderType
from models.user import User
from schemas.catalog import OrderOutFull
from schemas.order import OrderAdminCreate, OrderAdminResponse, OrderAdminUpdate
from services import order_service

router = APIRouter(prefix="/orders", tags=["admin-orders"])


def _to_admin(order: Order) -> OrderAdminResponse:
    return OrderAdminResponse(
        id=order.id,
        city_id=order.city_id,
        branch_id=order.branch_id,
        order_type=order.order_type,
        status=order.status,
        total=order.total,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        worker_id=order.worker_id,
        client_id=order.client_id,
        items_count=order.items_count,
    )


@router.get("", response_model=list[OrderAdminResponse])
async def list_orders(
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[OrderAdminResponse]:
    result = await db.execute(select(Order).order_by(Order.created_at_ms.desc()))
    return [_to_admin(o) for o in result.scalars().all()]


@router.post("", response_model=OrderAdminResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: OrderAdminCreate,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> OrderAdminResponse:
    import time

    order = Order(
        id=Order.make_id(),
        city_id=payload.city_id,
        branch_id=payload.branch_id,
        order_type=payload.order_type,
        status=payload.status,
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        worker_id=payload.worker_id,
        created_at_ms=int(time.time() * 1000),
        created_at=Order.make_created_at(),
    )
    db.add(order)
    await db.flush()
    await db.refresh(order)
    return _to_admin(order)


@router.get("/{order_id}", response_model=OrderOutFull)
async def get_order(
    order_id: str,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> OrderOutFull:
    return await order_service.get_order_out(db, order_id)


@router.put("/{order_id}", response_model=OrderAdminResponse)
async def update_order(
    order_id: str,
    payload: OrderAdminUpdate,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> OrderAdminResponse:
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    if payload.status is not None:
        order.status = payload.status
    if payload.worker_id is not None:
        order.worker_id = payload.worker_id
    await db.flush()
    await db.refresh(order)
    return _to_admin(order)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(
    order_id: str,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    await db.delete(order)