import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
DB_PATH = Path(os.environ.get("PYRIZHKY_DB_PATH", DATA_DIR / "pyrizhky.db"))

ACCOUNT_ROLES = {
    "customer": {"label": "Клієнт", "pin": ""},
    "worker": {"label": "Працівник", "pin": "2222"},
    "admin": {"label": "Адмін", "pin": "9999"},
}

STAFF_STATUSES = ("new", "cooking", "ready", "done")