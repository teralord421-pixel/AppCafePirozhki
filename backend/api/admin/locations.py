from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.deps import require_admin
from models.user import User
from schemas.catalog import BranchCreate, BranchOut, BranchUpdate, CityCreate, CityOut, CityUpdate
from services import catalog_service

router = APIRouter(tags=["admin-locations"])


@router.get("/cities", response_model=list[CityOut])
async def list_cities(
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[CityOut]:
    return await catalog_service.list_cities(db)


@router.post("/cities", response_model=CityOut, status_code=status.HTTP_201_CREATED)
async def create_city(
    payload: CityCreate,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CityOut:
    return await catalog_service.save_city(db, payload)


@router.get("/cities/{city_id}", response_model=CityOut)
async def get_city(
    city_id: str,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CityOut:
    return await catalog_service.get_city(db, city_id)


@router.put("/cities/{city_id}", response_model=CityOut)
async def update_city(
    city_id: str,
    payload: CityUpdate,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CityOut:
    return await catalog_service.update_city(db, city_id, payload)


@router.delete("/cities/{city_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_city(
    city_id: str,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    await catalog_service.delete_city(db, city_id)


@router.post("/branches", response_model=BranchOut, status_code=status.HTTP_201_CREATED)
async def create_branch(
    payload: BranchCreate,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> BranchOut:
    return await catalog_service.save_branch(db, payload)


@router.put("/branches/{branch_id}", response_model=BranchOut)
async def update_branch(
    branch_id: str,
    payload: BranchUpdate,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> BranchOut:
    return await catalog_service.update_branch(db, branch_id, payload)


@router.delete("/branches/{branch_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_branch(
    branch_id: str,
    _: Annotated[User, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    await catalog_service.delete_branch(db, branch_id)