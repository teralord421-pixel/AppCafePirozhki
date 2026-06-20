import re
import time
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.city import Branch, City
from models.menu import MenuItem, ProductDetail
from models.promo_code import PromoCode
from schemas.catalog import (
    BranchOut,
    CatalogOut,
    CityOut,
    MenuItemCreate,
    MenuItemOut,
    ProductDetailsOut,
    PromoCreate,
    PromoOut,
)


def _slug_id(prefix: str, value: str) -> str:
    base = re.sub(r"[^a-z0-9а-яіїєґ]+", "-", value.lower()).strip("-")
    return f"{prefix}-{base[:42] or int(time.time())}"


def _menu_to_out(item: MenuItem) -> MenuItemOut:
    details = None
    if item.details:
        details = ProductDetailsOut(
            weight=item.details.weight,
            kcal=item.details.kcal,
            ingredients=item.details.ingredients or [],
            allergens=item.details.allergens or [],
        )
    return MenuItemOut(
        id=item.id,
        category=item.category,
        mark=item.mark,
        name=item.name,
        description=item.description,
        price=item.price,
        tags=item.tags or [],
        featured=item.featured,
        image=item.image or "",
        details=details,
    )


async def list_cities(db: AsyncSession) -> list[CityOut]:
    result = await db.execute(select(City).options(selectinload(City.branches)).order_by(City.name))
    cities = result.scalars().all()
    return [
        CityOut(
            id=city.id,
            name=city.name,
            deliveryFee=city.delivery_fee,
            freeDeliveryFrom=city.free_delivery_from,
            deliveryEta=city.delivery_eta,
            branches=[
                BranchOut(
                    id=branch.id,
                    name=branch.name,
                    address=branch.address,
                    phone=branch.phone,
                    hours=branch.hours,
                    pickupEta=branch.pickup_eta,
                )
                for branch in city.branches
            ],
        )
        for city in cities
    ]


async def get_catalog(db: AsyncSession) -> CatalogOut:
    cities = await list_cities(db)
    menu_result = await db.execute(
        select(MenuItem).options(selectinload(MenuItem.details)).order_by(MenuItem.featured.desc(), MenuItem.name)
    )
    menu_items = menu_result.scalars().all()
    promo_result = await db.execute(select(PromoCode).order_by(PromoCode.title))
    promos = promo_result.scalars().all()

    product_details: dict[str, ProductDetailsOut] = {}
    menu_out = []
    for item in menu_items:
        out = _menu_to_out(item)
        menu_out.append(out)
        if out.details:
            product_details[item.id] = out.details

    return CatalogOut(
        cities=cities,
        menuItems=menu_out,
        productDetails=product_details,
        promos=[
            PromoOut(
                id=p.id,
                title=p.title,
                text=p.text,
                code=p.code,
                discount=p.discount,
                minSubtotal=p.min_subtotal,
            )
            for p in promos
        ],
    )


async def get_menu_item(db: AsyncSession, item_id: str) -> MenuItemOut:
    result = await db.execute(
        select(MenuItem).options(selectinload(MenuItem.details)).where(MenuItem.id == item_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Товар не знайдено")
    return _menu_to_out(item)


async def save_menu_item(db: AsyncSession, payload: MenuItemCreate) -> MenuItemOut:
    item_id = payload.id or _slug_id("item", payload.name)
    result = await db.execute(select(MenuItem).where(MenuItem.id == item_id))
    item = result.scalar_one_or_none()
    if item is None:
        item = MenuItem(id=item_id)
        db.add(item)

    item.category = payload.category
    item.mark = payload.mark
    item.name = payload.name
    item.description = payload.description
    item.price = payload.price
    item.tags = payload.tags
    item.featured = payload.featured
    item.image = payload.image

    if item.details is None:
        item.details = ProductDetail(menu_item_id=item_id)
    item.details.weight = payload.weight
    item.details.kcal = payload.kcal
    item.details.ingredients = payload.ingredients
    item.details.allergens = payload.allergens

    await db.flush()
    await db.refresh(item, ["details"])
    return _menu_to_out(item)


async def delete_menu_item(db: AsyncSession, item_id: str) -> None:
    result = await db.execute(select(MenuItem).where(MenuItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Товар не знайдено")
    await db.delete(item)


async def save_promo(db: AsyncSession, payload: PromoCreate) -> PromoOut:
    promo_id = payload.id or _slug_id("promo", payload.code or payload.title)
    dup = await db.execute(
        select(PromoCode).where(PromoCode.code == payload.code, PromoCode.id != promo_id)
    )
    if dup.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Промокод вже існує")

    result = await db.execute(select(PromoCode).where(PromoCode.id == promo_id))
    promo = result.scalar_one_or_none()
    if promo is None:
        promo = PromoCode(id=promo_id)
        db.add(promo)

    promo.title = payload.title
    promo.text = payload.text
    promo.code = payload.code
    promo.discount = payload.discount
    promo.min_subtotal = payload.min_subtotal
    await db.flush()
    await db.refresh(promo)
    return PromoOut(
        id=promo.id,
        title=promo.title,
        text=promo.text,
        code=promo.code,
        discount=promo.discount,
        minSubtotal=promo.min_subtotal,
    )


async def delete_promo(db: AsyncSession, promo_id: str) -> None:
    result = await db.execute(select(PromoCode).where(PromoCode.id == promo_id))
    promo = result.scalar_one_or_none()
    if not promo:
        raise HTTPException(status_code=404, detail="Акцію не знайдено")
    await db.delete(promo)