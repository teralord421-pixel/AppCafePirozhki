from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_NAME: str = "Cafe Order API"
    DEBUG: bool = False

    DATABASE_URL: str = "postgresql+asyncpg://cafe_user:cafe_password@db:5432/cafe_db"

    JWT_SECRET_KEY: str = "change-me-in-production-use-openssl-rand-hex-32"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24

    # Comma-separated origins; override via env for production.
    CORS_ORIGINS: str = (
        "http://localhost:8000,"
        "http://127.0.0.1:8000,"
        "http://localhost:5500,"
        "http://127.0.0.1:5500"
    )


settings = Settings()