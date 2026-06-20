from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.legacy_auth import pin_login
from schemas.catalog import PinLoginRequest, PinLoginResponse

router = APIRouter(tags=["legacy-auth"])


@router.post("/auth/login", response_model=PinLoginResponse)
async def auth_login(payload: PinLoginRequest, db: AsyncSession = Depends(get_db)) -> PinLoginResponse:
    return await pin_login(payload, db)