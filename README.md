# Пиріжки.lab — система замовлень для кафе

Повноцінна система з трьох частин:

| Компонент | Шлях | Призначення |
|-----------|------|-------------|
| **Мобільний PWA** | `/` (корінь) | Клієнт + працівник + адмін у одному застосунку |
| **Адмін-панель** | `/admin/` | Веб-панель для GitHub Pages або `/admin/` на сервері |
| **API + БД** | `backend/` | FastAPI, PostgreSQL, JWT, WebSocket |

## Швидкий старт (Docker)

```powershell
cd backend
docker compose up --build
```

Відкрийте:

- Мобільний застосунок: http://localhost:8000/
- Адмін-панель: http://localhost:8000/admin/
- API документація: http://localhost:8000/docs

## Локальний запуск без Docker

1. Встановіть PostgreSQL і створіть БД `cafe_db`
2. Скопіюйте `backend/.env.example` → `backend/.env` і налаштуйте `DATABASE_URL`
3. Встановіть залежності:

```powershell
pip install -r requirements.txt
```

4. Запустіть:

```powershell
python main.py
```

## Тестові акаунти

| Роль | Логін | Пароль / PIN | Де використовується |
|------|-------|--------------|---------------------|
| Клієнт | — | без входу | Мобільний PWA |
| Працівник | `worker1` | PIN `2222` або пароль `worker123` | PWA → Працівник |
| Адмін | `admin` | PIN `9999` або пароль `admin123` | PWA або `/admin/` |

## Мобільний застосунок (PWA)

**Клієнт:** меню, кошик, акції, міста/філії, оформлення замовлення, історія, QR-код.

**Працівник:** черга замовлень, зміна статусів, QR-сканер, **WebSocket** для нових замовлень у реальному часі.

**Адмін (в PWA):** управління меню та промокодами прямо в застосунку.

## Адмін-панель (`admin_frontend/`)

Статичний сайт без збірки. CRUD: користувачі, замовлення, маркетингові акції.

Для GitHub Pages змініть `API_BASE_URL` у `admin_frontend/app.js` на URL вашого API.

## API

### Публічні
- `GET /api/catalog` — міста, меню, промокоди
- `POST /api/orders` — створити замовлення (клієнт)
- `GET /api/orders/{id}` — статус замовлення

### Авторизація
- `POST /api/auth/login` — PIN для працівника/адміна (PWA)
- `POST /api/login` — логін/пароль (адмін-панель)

### Працівник
- `GET /api/orders` — черга
- `PATCH /api/orders/{id}/status` — оновити статус
- `WS /ws/worker/{token}` — real-time сповіщення

### Адмін
- `GET/POST/PUT/DELETE /api/admin/users`
- `GET/POST/PUT/DELETE /api/admin/orders`
- `GET/POST/PUT/DELETE /api/admin/promotions`

## Структура проєкту

```
├── index.html, app.js, styles.css   # Мобільний PWA
├── admin_frontend/                  # Адмін-панель
├── backend/
│   ├── api/                         # REST ендпоінти
│   ├── core/                        # JWT, CORS, WebSocket, seed
│   ├── models/                      # SQLAlchemy моделі
│   ├── schemas/                     # Pydantic схеми
│   ├── services/                    # Бізнес-логіка
│   ├── main.py                      # Точка входу FastAPI
│   ├── Dockerfile
│   └── docker-compose.yml
├── assets/                          # Логотип, іконки PWA
└── main.py                          # Запуск uvicorn
```

## Production

1. Змініть `JWT_SECRET_KEY` у `docker-compose.yml`
2. Додайте URL GitHub Pages у `CORS_ORIGINS`
3. Не використовуйте тестові паролі