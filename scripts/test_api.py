from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

test_db = ROOT / "data" / "test_pyrizhky.db"
os.environ["PYRIZHKY_DB_PATH"] = str(test_db)

from fastapi.testclient import TestClient

from backend.app import create_app
from backend.database import init_db
from backend.seed import seed_if_empty


def setup_test_db() -> None:
    if test_db.exists():
        test_db.unlink()
    init_db()
    seed_if_empty()


def main() -> None:
    setup_test_db()
    client = TestClient(create_app())

    health = client.get("/api/health")
    assert health.status_code == 200, health.text
    assert health.json()["status"] == "ok"

    catalog = client.get("/api/catalog")
    assert catalog.status_code == 200, catalog.text
    payload = catalog.json()
    assert len(payload["cities"]) == 5
    assert len(payload["menuItems"]) == 10
    assert len(payload["promos"]) == 3

    order = client.post(
        "/api/orders",
        json={
            "cityId": "kyiv",
            "branchId": "kyiv-podil",
            "orderType": "pickup",
            "items": [{"id": "potato-fried", "quantity": 2}],
            "customerName": "Тест",
            "customerPhone": "+380671234567",
            "payment": "картка",
        },
    )
    assert order.status_code == 201, order.text
    order_id = order.json()["id"]
    assert order.json()["total"] == 68

    forbidden = client.get("/api/orders")
    assert forbidden.status_code == 401

    login = client.post("/api/auth/login", json={"role": "worker", "pin": "2222"})
    assert login.status_code == 200, login.text
    token = login.json()["token"]

    orders = client.get("/api/orders", headers={"Authorization": f"Bearer {token}"})
    assert orders.status_code == 200, orders.text
    assert any(item["id"] == order_id for item in orders.json())

    status = client.patch(
        f"/api/orders/{order_id}/status",
        headers={"Authorization": f"Bearer {token}"},
        json={"status": "cooking"},
    )
    assert status.status_code == 200, status.text
    assert status.json()["status"] == "cooking"

    admin_login = client.post("/api/auth/login", json={"role": "admin", "pin": "9999"})
    admin_token = admin_login.json()["token"]
    created = client.post(
        "/api/menu",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "name": "Тестовий пиріжок",
            "category": "fried",
            "mark": "Т",
            "description": "Для smoke test",
            "price": 55,
            "tags": ["тест"],
            "featured": False,
        },
    )
    assert created.status_code == 200, created.text

    print("api ok")


if __name__ == "__main__":
    main()