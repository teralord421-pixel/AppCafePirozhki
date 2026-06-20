from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from core.database import get_db
from core.deps import require_worker
from core.security import safe_decode_token
from core.websocket import worker_manager
from models.order import Order, OrderStatus
from models.user import User
from schemas.catalog import OrderOutFull, OrderStatusUpdate
from services import order_service

router = APIRouter(prefix="/worker", tags=["worker"])


async def worker_websocket(websocket: WebSocket, token: str) -> None:
    payload = safe_decode_token(token)
    if payload is None or payload.get("role") not in {"worker", "admin"}:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await worker_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        worker_manager.disconnect(websocket)


@router.get("/orders", response_model=list[OrderOutFull])
async def list_worker_orders(
    current_user: Annotated[User, Depends(require_worker)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[OrderOutFull]:
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(
            or_(Order.worker_id == current_user.id, Order.worker_id.is_(None)),
            Order.status.notin_([OrderStatus.DONE, OrderStatus.CANCELED]),
        )
        .order_by(Order.created_at_ms.desc())
    )
    orders = result.scalars().all()
    out = []
    for order in orders:
        out.append(await order_service.get_order_out(db, order.id))
    return out


@router.patch("/orders/{order_id}", response_model=OrderOutFull)
async def update_worker_order(
    order_id: str,
    payload: OrderStatusUpdate,
    current_user: Annotated[User, Depends(require_worker)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> OrderOutFull:
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.worker_id is None:
        order.worker_id = current_user.id
    return await order_service.update_order_status(db, order_id, payload)