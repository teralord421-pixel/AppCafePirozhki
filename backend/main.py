from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api import api_router
from api.worker import worker_websocket
from core.config import settings
from core.database import async_session_factory, init_db
from core.seed import seed_initial_data

ROOT = Path(__file__).resolve().parents[1]


@asynccontextmanager
async def lifespan(_: FastAPI):
    await init_db()
    async with async_session_factory() as session:
        await seed_initial_data(session)
        await session.commit()
    yield


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

# CORS: add your GitHub Pages URL here, e.g. "https://<username>.github.io"
cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=(cors_origins + ["*"]) if settings.DEBUG else cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.add_api_websocket_route("/ws/worker/{token}", worker_websocket)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "pyrizhky-lab"}


app.mount("/admin", StaticFiles(directory=ROOT / "admin_frontend", html=True), name="admin")
app.mount("/", StaticFiles(directory=ROOT, html=True), name="static")