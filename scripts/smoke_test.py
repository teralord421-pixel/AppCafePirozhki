from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TEXT_FILES = [
    "index.html",
    "app.js",
    "styles.css",
    "README.md",
    "manifest.webmanifest",
    "service-worker.js",
]
MOJIBAKE_MARKERS = ("Рџ", "СЊ", "вЂ", "Г—", "в€’")


def read_text(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def check_utf8() -> None:
    for path in TEXT_FILES:
      text = read_text(path)
      markers = [marker for marker in MOJIBAKE_MARKERS if marker in text]
      if markers:
          raise AssertionError(f"{path}: possible mojibake markers {markers}")


def check_manifest() -> None:
    manifest = json.loads(read_text("manifest.webmanifest"))
    for key in ("name", "start_url", "icons"):
        if key not in manifest:
            raise AssertionError(f"manifest.webmanifest: missing {key}")
    for icon in manifest["icons"]:
        src = icon["src"]
        if not (ROOT / src).exists():
            raise AssertionError(f"manifest icon missing: {src}")


def check_service_worker_assets() -> None:
    service_worker = read_text("service-worker.js")
    assets = re.findall(r'"(\./[^"]+)"', service_worker)
    for asset in assets:
        path = asset[2:] or "index.html"
        if path == "":
            path = "index.html"
        if asset == "./":
            continue
        if not (ROOT / path).exists():
            raise AssertionError(f"service worker asset missing: {asset}")


def check_dom_ids() -> None:
    html = read_text("index.html")
    js = read_text("app.js")
    ids = set(re.findall(r'id="([^"]+)"', html))
    ids.add("installButton")  # Created dynamically after beforeinstallprompt.
    selectors = set(re.findall(r'\$\("#([A-Za-z0-9_-]+)"\)', js))
    missing = sorted(selectors - ids)
    if missing:
        raise AssertionError(f"missing DOM ids referenced by JS: {missing}")


def check_js_syntax() -> None:
    subprocess.run(["node", "--check", str(ROOT / "app.js")], check=True)


def main() -> None:
    check_utf8()
    check_manifest()
    check_service_worker_assets()
    check_dom_ids()
    check_js_syntax()
    print("smoke ok")


if __name__ == "__main__":
    main()
