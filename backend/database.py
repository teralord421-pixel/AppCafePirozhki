from __future__ import annotations

import json
import sqlite3
import threading
from contextlib import contextmanager
from typing import Any, Iterator

from backend import config

_local = threading.local()


def _connect() -> sqlite3.Connection:
    config.DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(config.DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def get_connection() -> sqlite3.Connection:
    conn = getattr(_local, "conn", None)
    if conn is None:
        conn = _connect()
        _local.conn = conn
    return conn


@contextmanager
def db_transaction() -> Iterator[sqlite3.Connection]:
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise


def init_db() -> None:
    conn = get_connection()
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS cities (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            delivery_fee INTEGER NOT NULL,
            free_delivery_from INTEGER NOT NULL,
            delivery_eta TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS branches (
            id TEXT PRIMARY KEY,
            city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            phone TEXT NOT NULL,
            hours TEXT NOT NULL,
            pickup_eta TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS menu_items (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            mark TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price INTEGER NOT NULL,
            tags TEXT NOT NULL DEFAULT '[]',
            featured INTEGER NOT NULL DEFAULT 0,
            image TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS product_details (
            menu_item_id TEXT PRIMARY KEY REFERENCES menu_items(id) ON DELETE CASCADE,
            weight TEXT NOT NULL,
            kcal TEXT NOT NULL,
            ingredients TEXT NOT NULL DEFAULT '[]',
            allergens TEXT NOT NULL DEFAULT '[]'
        );

        CREATE TABLE IF NOT EXISTS promos (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            text TEXT NOT NULL,
            code TEXT NOT NULL UNIQUE,
            discount INTEGER NOT NULL,
            min_subtotal INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            city_id TEXT NOT NULL,
            branch_id TEXT NOT NULL,
            order_type TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'new',
            total INTEGER NOT NULL,
            promo_code TEXT NOT NULL DEFAULT '',
            bonus_discount INTEGER NOT NULL DEFAULT 0,
            items_count INTEGER NOT NULL,
            eta TEXT NOT NULL,
            scheduled_time TEXT NOT NULL DEFAULT '',
            payment TEXT NOT NULL,
            address TEXT NOT NULL DEFAULT '',
            apartment TEXT NOT NULL DEFAULT '',
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            created_at_ms INTEGER NOT NULL,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            menu_item_id TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS auth_tokens (
            token TEXT PRIMARY KEY,
            role TEXT NOT NULL,
            created_at_ms INTEGER NOT NULL
        );
        """
    )
    conn.commit()


def dumps_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False)


def loads_json(value: str | None, default: Any) -> Any:
    if not value:
        return default
    return json.loads(value)