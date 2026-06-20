from fastapi import APIRouter

from api.admin import orders, promotions, users

router = APIRouter(prefix="/admin")
router.include_router(users.router)
router.include_router(orders.router)
router.include_router(promotions.router)