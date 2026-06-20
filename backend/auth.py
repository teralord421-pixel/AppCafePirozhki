from __future__ import annotations

import secrets
import time
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status

from backend.config import ACCOUNT_ROLES
from backend.database import get_connection
from backend.schemas import LoginRequest, LoginResponse, Role


def create_token(role: Role) -> str:
    token = secrets.token_urlsafe(32)
    conn = get_connection()
    conn.execute(
        "INSERT INTO auth_tokens (token, role, created_at_ms) VALUES (?, ?, ?)",
        (token, role, int(time.time() * 1000)),
    )
    conn.commit()
    return token


def login(payload: LoginRequest) -> LoginResponse:
    role_config = ACCOUNT_ROLES.get(payload.role)
    if not role_config:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Невідома роль")

    if payload.role != "customer" and payload.pin != role_config["pin"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Невірний PIN")

    token = create_token(payload.role)
    return LoginResponse(token=token, role=payload.role, label=role_config["label"])


def resolve_role(authorization: str | None) -> Role | None:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        return None
    row = get_connection().execute(
        "SELECT role FROM auth_tokens WHERE token = ?",
        (token,),
    ).fetchone()
    if not row:
        return None
    return row["role"]


def require_role(*allowed: Role):
    def dependency(authorization: Annotated[str | None, Header()] = None) -> Role:
        role = resolve_role(authorization)
        if role is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Потрібна авторизація")
        if role not in allowed:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недостатньо прав")
        return role

    return dependency