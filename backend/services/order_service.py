import re
import time
from typing import Any

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.city import Branch, City
from models.menu import MenuItem
from models.order import Order, OrderItem, OrderStatus, OrderType
from models.promo_code import PromoCode
from schemas.catalog import OrderCreateFull, OrderOutFull, OrderStatusUpdate


def _validate_phone(phone: str) -> None:
    digits = re.sub(r"\D", "", phone)
    if len(digits) < 10 or len(digits) > 13:
        raise HTTPException(status_code=422, detail="Некоректний телефон")


async def _get_city(db: AsyncSession, city_id: str) -> City:
    result = await db.execute(select(City).where(City.id == city_id))
    city = result.scalar_one_or_none()
    if not city:
        raise HTTPException(status_code=404, detail="Місто не знайдено")
    return city


async def _get_branch(db: AsyncSession, branch_id: str, city_id: str | None = None) -> Branch:
    query = select(Branch).where(Branch.id == branch_id)
    if city_id:
        query = query.where(Branch.city_id == city_id)
    result = await db.execute(query)
    branch = result.scalar_one_or_none()
    if not branch:
        raise HTTPException(status_code=404, detail="Філію не знайдено")
    return branch


async def _calculate_order(db: AsyncSession, payload: OrderCreateFull) -> dict[str, Any]:
    if not payload.items:
        raise HTTPException(status_code=422, detail="Кошик порожній")

    city = await _get_city(db, payload.city_id)
    branch = await _get_branch(db, payload.branch_id, payload.city_id)

    subtotal = 0
    items_count = 0
    normalized_items = []
    for entry in payload.items:
        result = await db.execute(select(MenuItem).where(MenuItem.id == entry.id))
        menu_row = result.scalar_one_or_none()
        if not menu_row:
            raise HTTPException(status_code=404, detail=f"Товар {entry.id} не знайдено")
        subtotal += menu_row.price * entry.quantity
        items_count += entry.quantity
        normalized_items.append(
            {"id": entry.id, "quantity": entry.quantity, "unit_price": menu_row.price}
        )

    promo_discount = 0
    promo_code = payload.promo_code.strip().upper()
    if promo_code:
        promo_result = await db.execute(select(PromoCode).where(PromoCode.code == promo_code))
        promo_row = promo_result.scalar_one_or_none()
        if not promo_row:
            raise HTTPException(status_code=404, detail="Промокод не знайдено")
        if subtotal < promo_row.min_subtotal:
            raise HTTPException(
                status_code=422,
                detail=f"Промокод працює від {promo_row.min_subtotal} грн",
            )
        promo_discount = round(subtotal * promo_row.discount / 100)

    bonus_discount = 50 if payload.use_bonus and subtotal >= 100 else 0
    delivery_fee = 0
    if payload.order_type == "delivery":
        delivery_fee = 0 if subtotal >= city.free_delivery_from else city.delivery_fee

    total = max(0, subtotal - promo_discount - bonus_discount + delivery_fee)
    eta = branch.pickup_eta if payload.order_type == "pickup" else city.delivery_eta

    return {
        "city": city,
        "branch": branch,
        "items_count": items_count,
        "promo_code": promo_code,
        "bonus_discount": bonus_discount,
        "total": total,
        "eta": eta,
        "items": normalized_items,
    }


def _order_to_out(order: Order, city: City, branch: Branch) -> OrderOutFull:
    type_label = "Самовивіз" if order.order_type == OrderType.PICKUP else "Доставка"
    return OrderOutFull(
        id=order.id,
        city=city.name,
        branch=branch.name,
        cityId=order.city_id,
        branchId=order.branch_id,
        orderType=order.order_type.value,
        typeLabel=type_label,
        status=order.status.value,
        total=order.total,
        promoCode=order.promo_code,
        bonusDiscount=order.bonus_discount,
        itemsCount=order.items_count,
        eta=order.eta,
        time=order.scheduled_time,
        payment=order.payment,
        address=order.address,
        apartment=order.apartment,
        items=[
            {"id": item.menu_item_id, "quantity": item.quantity, "unitPrice": item.unit_price}
            for item in order.items
        ],
        createdAtMs=order.created_at_ms,
        createdAt=order.created_at,
        customer={"name": order.customer_name, "phone": order.customer_phone},
    )


async def _load_order(db: AsyncSession, order_id: str) -> Order:
    result = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Замовлення не знайдено")
    return order


async def get_order_out(db: AsyncSession, order_id: str) -> OrderOutFull:
    order = await _load_order(db, order_id)
    city = await _get_city(db, order.city_id)
    branch = await _get_branch(db, order.branch_id)
    return _order_to_out(order, city, branch)


async def create_order(db: AsyncSession, payload: OrderCreateFull) -> OrderOutFull:
    _validate_phone(payload.customer_phone)
    if payload.order_type == "delivery" and not payload.address.strip():
        raise HTTPException(status_code=422, detail="Вкажіть адресу доставки")

    calc = await _calculate_order(db, payload)
    order = Order(
        id=Order.make_id(),
        city_id=payload.city_id,
        branch_id=payload.branch_id,
        order_type=OrderType(payload.order_type),
        status=OrderStatus.NEW,
        total=calc["total"],
        promo_code=calc["promo_code"],
        bonus_discount=calc["bonus_discount"],
        items_count=calc["items_count"],
        eta=calc["eta"],
        scheduled_time=payload.scheduled_time,
        payment=payload.payment,
        address=payload.address,
        apartment=payload.apartment,
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        created_at_ms=int(time.time() * 1000),
        created_at=Order.make_created_at(),
    )

    db.add(order)
    await db.flush()

    for item in calc["items"]:
        db.add(
            OrderItem(
                order_id=order.id,
                menu_item_id=item["id"],
                quantity=item["quantity"],
                unit_price=item["unit_price"],
            )
        )
    await db.flush()
    await db.refresh(order, ["items"])
    return _order_to_out(order, calc["city"], calc["branch"])


async def list_orders(db: AsyncSession, limit: int = 50) -> list[OrderOutFull]:
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .order_by(Order.created_at_ms.desc())
        .limit(limit)
    )
    orders = result.scalars().all()
    out = []
    for order in orders:
        city = await _get_city(db, order.city_id)
        branch = await _get_branch(db, order.branch_id)
        out.append(_order_to_out(order, city, branch))
    return out


async def update_order_status(
    db: AsyncSession, order_id: str, payload: OrderStatusUpdate
) -> OrderOutFull:
    order = await _load_order(db, order_id)
    order.status = OrderStatus(payload.status)
    await db.flush()
    city = await _get_city(db, order.city_id)
    branch = await _get_branch(db, order.branch_id)
    return _order_to_out(order, city, branch)