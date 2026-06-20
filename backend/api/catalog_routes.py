from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.legacy_auth import require_legacy_role
from schemas.catalog import (
    CatalogOut,
    CityOut,
    LegacyRole,
    MenuItemCreate,
    MenuItemOut,
    PromoCreate,
    PromoOut,
)
from services import catalog_service

router = APIRouter(tags=["catalog"])


@router.get("/catalog", response_model=CatalogOut)
async def catalog(db: AsyncSession = Depends(get_db)) -> CatalogOut:
    return await catalog_service.get_catalog(db)


@router.get("/locations", response_model=list[CityOut])
async def locations(db: AsyncSession = Depends(get_db)) -> list[CityOut]:
    return await catalog_service.list_cities(db)


@router.get("/menu", response_model=list[MenuItemOut])
async def menu(db: AsyncSession = Depends(get_db)) -> list[MenuItemOut]:
    catalog = await catalog_service.get_catalog(db)
    return catalog.menu_items


@router.get("/menu/{item_id}", response_model=MenuItemOut)
async def menu_item(item_id: str, db: AsyncSession = Depends(get_db)) -> MenuItemOut:
    return await catalog_service.get_menu_item(db, item_id)


@router.post("/menu", response_model=MenuItemOut)
async def create_menu_item(
    payload: MenuItemCreate,
    _: Annotated[LegacyRole, Depends(require_legacy_role("admin"))],
    db: AsyncSession = Depends(get_db),
) -> MenuItemOut:
    return await catalog_service.save_menu_item(db, payload)


@router.put("/menu/{item_id}", response_model=MenuItemOut)
async def update_menu_item(
    item_id: str,
    payload: MenuItemCreate,
    _: Annotated[LegacyRole, Depends(require_legacy_role("admin"))],
    db: AsyncSession = Depends(get_db),
) -> MenuItemOut:
    payload.id = item_id
    return await catalog_service.save_menu_item(db, payload)


@router.delete("/menu/{item_id}", status_code=204)
async def remove_menu_item(
    item_id: str,
    _: Annotated[LegacyRole, Depends(require_legacy_role("admin"))],
    db: AsyncSession = Depends(get_db),
) -> None:
    await catalog_service.delete_menu_item(db, item_id)


@router.get("/promos", response_model=list[PromoOut])
async def promos(db: AsyncSession = Depends(get_db)) -> list[PromoOut]:
    catalog = await catalog_service.get_catalog(db)
    return catalog.promos


@router.post("/promos", response_model=PromoOut)
async def create_promo(
    payload: PromoCreate,
    _: Annotated[LegacyRole, Depends(require_legacy_role("admin"))],
    db: AsyncSession = Depends(get_db),
) -> PromoOut:
    return await catalog_service.save_promo(db, payload)


@router.put("/promos/{promo_id}", response_model=PromoOut)
async def update_promo(
    promo_id: str,
    payload: PromoCreate,
    _: Annotated[LegacyRole, Depends(require_legacy_role("admin"))],
    db: AsyncSession = Depends(get_db),
) -> PromoOut:
    payload.id = promo_id
    return await catalog_service.save_promo(db, payload)


@router.delete("/promos/{promo_id}", status_code=204)
async def remove_promo(
    promo_id: str,
    _: Annotated[LegacyRole, Depends(require_legacy_role("admin"))],
    db: AsyncSession = Depends(get_db),
) -> None:
    await catalog_service.delete_promo(db, promo_id)