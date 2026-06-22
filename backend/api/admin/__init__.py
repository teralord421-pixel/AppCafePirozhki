from fastapi import APIRouter

from api.admin import locations, menu, orders, promos, promotions, users

router = APIRouter(prefix="/admin")
router.include_router(users.router)
router.include_router(orders.router)
router.include_router(menu.router)
router.include_router(promos.router)
router.include_router(promotions.router)
router.include_router(locations.router)