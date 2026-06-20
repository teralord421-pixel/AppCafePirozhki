from __future__ import annotations

import argparse
import sys
import webbrowser
from pathlib import Path

import uvicorn

BACKEND_DIR = Path(__file__).resolve().parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))


def main() -> None:
    parser = argparse.ArgumentParser(description="Пиріжки.lab — мобільний застосунок + API (PostgreSQL).")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind. Use 0.0.0.0 for phone testing.")
    parser.add_argument("--port", type=int, default=8000, help="Port to serve on.")
    parser.add_argument("--no-browser", action="store_true", help="Do not open browser automatically.")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload for development.")
    args = parser.parse_args()

    url = f"http://{args.host}:{args.port}/"
    print(f"Пиріжки.lab: {url}")
    print(f"Адмін-панель: http://{args.host}:{args.port}/admin/")
    print(f"API docs: http://{args.host}:{args.port}/docs")
    print("Press Ctrl+C to stop.")

    if not args.no_browser:
        webbrowser.open(url)

    uvicorn.run(
        "main:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        reload_dirs=[str(BACKEND_DIR)] if args.reload else None,
    )


if __name__ == "__main__":
    main()