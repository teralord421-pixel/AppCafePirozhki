from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from models.promotion import Promotion
from schemas.promotion import PromotionResponse

router = APIRouter(tags=["public"])


@router.get("/promotions", response_model=list[PromotionResponse])
async def list_active_promotions(db: AsyncSession = Depends(get_db)) -> list[Promotion]:
    result = await db.execute(
        select(Promotion).where(Promotion.is_active.is_(True)).order_by(Promotion.id.desc())
    )
    return list(result.scalars().all())