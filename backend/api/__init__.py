from fastapi import APIRouter

from api import (
    auth,
    catalog_routes,
    client,
    legacy_auth,
    orders_routes,
    public,
    worker,
)
from api.admin import router as admin_router

api_router = APIRouter(prefix="/api")
api_router.include_router(legacy_auth.router)
api_router.include_router(auth.router)
api_router.include_router(public.router)
api_router.include_router(catalog_routes.router)
api_router.include_router(orders_routes.router)
api_router.include_router(client.router)
api_router.include_router(worker.router)
api_router.include_router(admin_router)


@api_router.get("/health")
async def api_health() -> dict[str, str]:
    return {"status": "ok", "service": "pyrizhky-lab"}