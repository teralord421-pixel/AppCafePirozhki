from __future__ import annotations

import re
import time
from datetime import datetime
from typing import Any

from fastapi import HTTPException, status

from backend.database import db_transaction, dumps_json, get_connection, loads_json
from backend.schemas import (
    CatalogOut,
    CityOut,
    MenuItemCreate,
    MenuItemOut,
    OrderCreate,
    OrderOut,
    ProductDetailsOut,
    PromoCreate,
    PromoOut,
)


def _slug_id(prefix: str, value: str) -> str:
    base = re.sub(r"[^a-z0-9а-яіїєґ]+", "-", value.lower(), flags=re.IGNORECASE).strip("-")
    return f"{prefix}-{base[:42] or int(time.time())}"


def _row_menu_item(row: Any, details: ProductDetailsOut | None = None) -> MenuItemOut:
    return MenuItemOut(
        id=row["id"],
        category=row["category"],
        mark=row["mark"],
        name=row["name"],
        description=row["description"],
        price=row["price"],
        tags=loads_json(row["tags"], []),
        featured=bool(row["featured"]),
        image=row["image"] or "",
        details=details,
    )


def _row_promo(row: Any) -> PromoOut:
    return PromoOut(
        id=row["id"],
        title=row["title"],
        text=row["text"],
        code=row["code"],
        discount=row["discount"],
        minSubtotal=row["min_subtotal"],
    )


def list_cities() -> list[CityOut]:
    conn = get_connection()
    cities = conn.execute("SELECT * FROM cities ORDER BY name").fetchall()
    branches = conn.execute("SELECT * FROM branches ORDER BY name").fetchall()
    branches_by_city: dict[str, list] = {}
    for branch in branches:
        branches_by_city.setdefault(branch["city_id"], []).append(branch)

    result = []
    for city in cities:
        result.append(
            CityOut(
                id=city["id"],
                name=city["name"],
                deliveryFee=city["delivery_fee"],
                freeDeliveryFrom=city["free_delivery_from"],
                deliveryEta=city["delivery_eta"],
                branches=[
                    {
                        "id": branch["id"],
                        "name": branch["name"],
                        "address": branch["address"],
                        "phone": branch["phone"],
                        "hours": branch["hours"],
                        "pickupEta": branch["pickup_eta"],
                    }
                    for branch in branches_by_city.get(city["id"], [])
                ],
            )
        )
    return result


def get_catalog() -> CatalogOut:
    conn = get_connection()
    menu_rows = conn.execute("SELECT * FROM menu_items ORDER BY featured DESC, name").fetchall()
    detail_rows = conn.execute("SELECT * FROM product_details").fetchall()
    promo_rows = conn.execute("SELECT * FROM promos ORDER BY title").fetchall()

    details_map = {
        row["menu_item_id"]: ProductDetailsOut(
            weight=row["weight"],
            kcal=row["kcal"],
            ingredients=loads_json(row["ingredients"], []),
            allergens=loads_json(row["allergens"], []),
        )
        for row in detail_rows
    }

    product_details = {item_id: details for item_id, details in details_map.items()}
    menu_items = [_row_menu_item(row, details_map.get(row["id"])) for row in menu_rows]

    return CatalogOut(
        cities=list_cities(),
        menuItems=menu_items,
        productDetails=product_details,
        promos=[_row_promo(row) for row in promo_rows],
    )


def list_menu_items() -> list[MenuItemOut]:
    return get_catalog().menu_items


def get_menu_item(item_id: str) -> MenuItemOut:
    conn = get_connection()
    row = conn.execute("SELECT * FROM menu_items WHERE id = ?", (item_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Товар не знайдено")
    detail_row = conn.execute(
        "SELECT * FROM product_details WHERE menu_item_id = ?",
        (item_id,),
    ).fetchone()
    details = None
    if detail_row:
        details = ProductDetailsOut(
            weight=detail_row["weight"],
            kcal=detail_row["kcal"],
            ingredients=loads_json(detail_row["ingredients"], []),
            allergens=loads_json(detail_row["allergens"], []),
        )
    return _row_menu_item(row, details)


def save_menu_item(payload: MenuItemCreate) -> MenuItemOut:
    item_id = payload.id or _slug_id("item", payload.name)
    with db_transaction() as conn:
        conn.execute(
            """
            INSERT INTO menu_items (id, category, mark, name, description, price, tags, featured, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                category = excluded.category,
                mark = excluded.mark,
                name = excluded.name,
                description = excluded.description,
                price = excluded.price,
                tags = excluded.tags,
                featured = excluded.featured,
                image = excluded.image
            """,
            (
                item_id,
                payload.category,
                payload.mark,
                payload.name,
                payload.description,
                payload.price,
                dumps_json(payload.tags),
                int(payload.featured),
                payload.image,
            ),
        )
        conn.execute(
            """
            INSERT INTO product_details (menu_item_id, weight, kcal, ingredients, allergens)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(menu_item_id) DO UPDATE SET
                weight = excluded.weight,
                kcal = excluded.kcal,
                ingredients = excluded.ingredients,
                allergens = excluded.allergens
            """,
            (
                item_id,
                payload.weight,
                payload.kcal,
                dumps_json(payload.ingredients),
                dumps_json(payload.allergens),
            ),
        )
    return get_menu_item(item_id)


def delete_menu_item(item_id: str) -> None:
    conn = get_connection()
    deleted = conn.execute("DELETE FROM menu_items WHERE id = ?", (item_id,)).rowcount
    conn.commit()
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Товар не знайдено")


def list_promos() -> list[PromoOut]:
    rows = get_connection().execute("SELECT * FROM promos ORDER BY title").fetchall()
    return [_row_promo(row) for row in rows]


def save_promo(payload: PromoCreate) -> PromoOut:
    promo_id = payload.id or _slug_id("promo", payload.code or payload.title)
    duplicate = get_connection().execute(
        "SELECT id FROM promos WHERE code = ? AND id != ?",
        (payload.code, promo_id),
    ).fetchone()
    if duplicate:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Промокод вже існує")

    with db_transaction() as conn:
        conn.execute(
            """
            INSERT INTO promos (id, title, text, code, discount, min_subtotal)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                title = excluded.title,
                text = excluded.text,
                code = excluded.code,
                discount = excluded.discount,
                min_subtotal = excluded.min_subtotal
            """,
            (
                promo_id,
                payload.title,
                payload.text,
                payload.code,
                payload.discount,
                payload.min_subtotal,
            ),
        )
    row = get_connection().execute("SELECT * FROM promos WHERE id = ?", (promo_id,)).fetchone()
    return _row_promo(row)


def delete_promo(promo_id: str) -> None:
    conn = get_connection()
    deleted = conn.execute("DELETE FROM promos WHERE id = ?", (promo_id,)).rowcount
    conn.commit()
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Акцію не знайдено")


def _get_city(city_id: str):
    row = get_connection().execute("SELECT * FROM cities WHERE id = ?", (city_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Місто не знайдено")
    return row


def _get_branch(branch_id: str, city_id: str | None = None):
    query = "SELECT * FROM branches WHERE id = ?"
    params: list[Any] = [branch_id]
    if city_id:
        query += " AND city_id = ?"
        params.append(city_id)
    row = get_connection().execute(query, params).fetchone()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Філію не знайдено")
    return row


def _validate_phone(phone: str) -> None:
    digits = re.sub(r"\D", "", phone)
    if len(digits) < 10 or len(digits) > 13:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Некоректний телефон")


def _calculate_order(payload: OrderCreate) -> dict[str, Any]:
    if not payload.items:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Кошик порожній")

    city = _get_city(payload.city_id)
    branch = _get_branch(payload.branch_id, payload.city_id)
    conn = get_connection()

    subtotal = 0
    items_count = 0
    normalized_items = []
    for entry in payload.items:
        menu_row = conn.execute("SELECT * FROM menu_items WHERE id = ?", (entry.id,)).fetchone()
        if not menu_row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Товар {entry.id} не знайдено")
        subtotal += menu_row["price"] * entry.quantity
        items_count += entry.quantity
        normalized_items.append(
            {
                "id": entry.id,
                "quantity": entry.quantity,
                "unit_price": menu_row["price"],
            }
        )

    promo_discount = 0
    promo_code = payload.promo_code.strip().upper()
    if promo_code:
        promo_row = conn.execute("SELECT * FROM promos WHERE code = ?", (promo_code,)).fetchone()
        if not promo_row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Промокод не знайдено")
        if subtotal < promo_row["min_subtotal"]:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Промокод працює від {promo_row['min_subtotal']} грн",
            )
        promo_discount = round(subtotal * promo_row["discount"] / 100)

    bonus_discount = 50 if payload.use_bonus and subtotal >= 100 else 0
    delivery_fee = 0
    if payload.order_type == "delivery":
        delivery_fee = 0 if subtotal >= city["free_delivery_from"] else city["delivery_fee"]

    total = max(0, subtotal - promo_discount - bonus_discount + delivery_fee)
    eta = branch["pickup_eta"] if payload.order_type == "pickup" else city["delivery_eta"]

    return {
        "city": city,
        "branch": branch,
        "subtotal": subtotal,
        "items_count": items_count,
        "promo_code": promo_code,
        "promo_discount": promo_discount,
        "bonus_discount": bonus_discount,
        "delivery_fee": delivery_fee,
        "total": total,
        "eta": eta,
        "items": normalized_items,
    }


def create_order(payload: OrderCreate) -> OrderOut:
    _validate_phone(payload.customer_phone)
    if payload.order_type == "delivery" and not payload.address.strip():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Вкажіть адресу доставки")

    calc = _calculate_order(payload)
    now_ms = int(time.time() * 1000)
    order_id = f"LAB-{str(now_ms)[-6:]}"
    created_at = datetime.now().strftime("%d.%m, %H:%M")

    with db_transaction() as conn:
        conn.execute(
            """
            INSERT INTO orders (
                id, city_id, branch_id, order_type, status, total, promo_code, bonus_discount,
                items_count, eta, scheduled_time, payment, address, apartment,
                customer_name, customer_phone, created_at_ms, created_at
            ) VALUES (?, ?, ?, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                order_id,
                payload.city_id,
                payload.branch_id,
                payload.order_type,
                calc["total"],
                calc["promo_code"],
                calc["bonus_discount"],
                calc["items_count"],
                calc["eta"],
                payload.scheduled_time,
                payload.payment,
                payload.address,
                payload.apartment,
                payload.customer_name,
                payload.customer_phone,
                now_ms,
                created_at,
            ),
        )
        for item in calc["items"]:
            conn.execute(
                """
                INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price)
                VALUES (?, ?, ?, ?)
                """,
                (order_id, item["id"], item["quantity"], item["unit_price"]),
            )

    return get_order(order_id)


def _order_to_out(row: Any, items: list[Any]) -> OrderOut:
    city = _get_city(row["city_id"])
    branch = _get_branch(row["branch_id"])
    type_label = "Самовивіз" if row["order_type"] == "pickup" else "Доставка"
    return OrderOut(
        id=row["id"],
        city=city["name"],
        branch=branch["name"],
        cityId=row["city_id"],
        branchId=row["branch_id"],
        orderType=row["order_type"],
        typeLabel=type_label,
        status=row["status"],
        total=row["total"],
        promoCode=row["promo_code"],
        bonusDiscount=row["bonus_discount"],
        itemsCount=row["items_count"],
        eta=row["eta"],
        time=row["scheduled_time"],
        payment=row["payment"],
        address=row["address"],
        apartment=row["apartment"],
        items=[
            {
                "id": item["menu_item_id"],
                "quantity": item["quantity"],
                "unitPrice": item["unit_price"],
            }
            for item in items
        ],
        createdAtMs=row["created_at_ms"],
        createdAt=row["created_at"],
        customer={"name": row["customer_name"], "phone": row["customer_phone"]},
    )


def get_order(order_id: str) -> OrderOut:
    conn = get_connection()
    row = conn.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Замовлення не знайдено")
    items = conn.execute(
        "SELECT * FROM order_items WHERE order_id = ? ORDER BY id",
        (order_id,),
    ).fetchall()
    return _order_to_out(row, items)


def list_orders(limit: int = 50) -> list[OrderOut]:
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM orders ORDER BY created_at_ms DESC LIMIT ?",
        (limit,),
    ).fetchall()
    result = []
    for row in rows:
        items = conn.execute(
            "SELECT * FROM order_items WHERE order_id = ? ORDER BY id",
            (row["id"],),
        ).fetchall()
        result.append(_order_to_out(row, items))
    return result


def update_order_status(order_id: str, status_value: str) -> OrderOut:
    conn = get_connection()
    updated = conn.execute(
        "UPDATE orders SET status = ? WHERE id = ?",
        (status_value, order_id),
    ).rowcount
    conn.commit()
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Замовлення не знайдено")
    return get_order(order_id)