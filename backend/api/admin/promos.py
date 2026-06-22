from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.deps import require_admin
from models.promo_code import PromoCode
from models.user import User
from schemas.catalog import PromoCreate, PromoOut
from services import catalog_service

router = APIRouter(prefix="/promos", tags=["admin-promos"])


@router.get("", response_model=list[PromoOut])
async def list_promos(
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[PromoOut]:
    catalog = await catalog_service.get_catalog(db)
    return catalog.promos


@router.get("/{promo_id}", response_model=PromoOut)
async def get_promo(
    promo_id: str,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PromoOut:
    result = await db.execute(select(PromoCode).where(PromoCode.id == promo_id))
    promo = result.scalar_one_or_none()
    if promo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Промокод не знайдено")
    return PromoOut(
        id=promo.id,
        title=promo.title,
        text=promo.text,
        code=promo.code,
        discount=promo.discount,
        minSubtotal=promo.min_subtotal,
    )


@router.post("", response_model=PromoOut, status_code=status.HTTP_201_CREATED)
async def create_promo(
    payload: PromoCreate,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PromoOut:
    return await catalog_service.save_promo(db, payload)


@router.put("/{promo_id}", response_model=PromoOut)
async def update_promo(
    promo_id: str,
    payload: PromoCreate,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PromoOut:
    payload.id = promo_id
    return await catalog_service.save_promo(db, payload)


@router.delete("/{promo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_promo(
    promo_id: str,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    await catalog_service.delete_promo(db, promo_id)