from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.deps import require_admin
from models.user import User
from schemas.catalog import MenuItemCreate, MenuItemOut
from services import catalog_service

router = APIRouter(prefix="/menu", tags=["admin-menu"])


@router.get("", response_model=list[MenuItemOut])
async def list_menu_items(
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[MenuItemOut]:
    catalog = await catalog_service.get_catalog(db)
    return catalog.menu_items


@router.get("/{item_id}", response_model=MenuItemOut)
async def get_menu_item(
    item_id: str,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> MenuItemOut:
    return await catalog_service.get_menu_item(db, item_id)


@router.post("", response_model=MenuItemOut, status_code=status.HTTP_201_CREATED)
async def create_menu_item(
    payload: MenuItemCreate,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> MenuItemOut:
    return await catalog_service.save_menu_item(db, payload)


@router.put("/{item_id}", response_model=MenuItemOut)
async def update_menu_item(
    item_id: str,
    payload: MenuItemCreate,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> MenuItemOut:
    payload.id = item_id
    return await catalog_service.save_menu_item(db, payload)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_menu_item(
    item_id: str,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    await catalog_service.delete_menu_item(db, item_id)