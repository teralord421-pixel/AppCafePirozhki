from __future__ import annotations

from backend.database import dumps_json, get_connection


CITIES = [
    {
        "id": "kyiv",
        "name": "Київ",
        "delivery_fee": 49,
        "free_delivery_from": 300,
        "delivery_eta": "25-35 хв",
        "branches": [
            {
                "id": "kyiv-podil",
                "name": "Поділ",
                "address": "вул. Нижній Вал 18",
                "phone": "+380 67 110 18 18",
                "hours": "08:00-21:00",
                "pickup_eta": "7-10 хв",
            },
            {
                "id": "kyiv-pozniaky",
                "name": "Позняки",
                "address": "просп. Григоренка 22",
                "phone": "+380 67 110 22 22",
                "hours": "08:00-22:00",
                "pickup_eta": "8-12 хв",
            },
        ],
    },
    {
        "id": "lviv",
        "name": "Львів",
        "delivery_fee": 45,
        "free_delivery_from": 280,
        "delivery_eta": "25-35 хв",
        "branches": [
            {
                "id": "lviv-halytskyi",
                "name": "Галицька",
                "address": "вул. Братів Рогатинців 9",
                "phone": "+380 67 210 09 09",
                "hours": "08:00-21:00",
                "pickup_eta": "8-12 хв",
            },
            {
                "id": "lviv-sykhiv",
                "name": "Сихів",
                "address": "просп. Червоної Калини 60",
                "phone": "+380 67 210 60 60",
                "hours": "09:00-21:00",
                "pickup_eta": "9-13 хв",
            },
        ],
    },
    {
        "id": "odesa",
        "name": "Одеса",
        "delivery_fee": 55,
        "free_delivery_from": 320,
        "delivery_eta": "30-40 хв",
        "branches": [
            {
                "id": "odesa-center",
                "name": "Центр",
                "address": "вул. Дерибасівська 14",
                "phone": "+380 67 310 14 14",
                "hours": "08:00-22:00",
                "pickup_eta": "10-15 хв",
            },
            {
                "id": "odesa-tairova",
                "name": "Таїрова",
                "address": "вул. Академіка Корольова 72",
                "phone": "+380 67 310 72 72",
                "hours": "09:00-21:00",
                "pickup_eta": "10-14 хв",
            },
        ],
    },
    {
        "id": "dnipro",
        "name": "Дніпро",
        "delivery_fee": 50,
        "free_delivery_from": 300,
        "delivery_eta": "25-35 хв",
        "branches": [
            {
                "id": "dnipro-center",
                "name": "Центр",
                "address": "вул. Короленка 3",
                "phone": "+380 67 410 03 03",
                "hours": "08:00-21:00",
                "pickup_eta": "9-13 хв",
            },
            {
                "id": "dnipro-peremoha",
                "name": "Перемога",
                "address": "наб. Перемоги 86",
                "phone": "+380 67 410 86 86",
                "hours": "09:00-21:00",
                "pickup_eta": "10-14 хв",
            },
        ],
    },
    {
        "id": "kharkiv",
        "name": "Харків",
        "delivery_fee": 49,
        "free_delivery_from": 300,
        "delivery_eta": "30-40 хв",
        "branches": [
            {
                "id": "kharkiv-sumska",
                "name": "Сумська",
                "address": "вул. Сумська 35",
                "phone": "+380 67 510 35 35",
                "hours": "08:00-21:00",
                "pickup_eta": "10-14 хв",
            },
            {
                "id": "kharkiv-oleksiivka",
                "name": "Олексіївка",
                "address": "просп. Перемоги 62",
                "phone": "+380 67 510 62 62",
                "hours": "09:00-21:00",
                "pickup_eta": "10-15 хв",
            },
        ],
    },
]

MENU_ITEMS = [
    {
        "id": "potato-fried",
        "category": "fried",
        "mark": "К",
        "name": "Пиріжок з картоплею",
        "description": "Смажений, м'яке тісто, картопля з цибулею і легким перцем.",
        "price": 34,
        "tags": ["хіт", "вегетаріанський"],
        "featured": True,
    },
    {
        "id": "meat-fried",
        "category": "fried",
        "mark": "М",
        "name": "Пиріжок з м'ясом",
        "description": "Соковита начинка з курки та яловичини, без зайвого соусу.",
        "price": 48,
        "tags": ["ситний", "гарячий"],
        "featured": True,
    },
    {
        "id": "cabbage-baked",
        "category": "baked",
        "mark": "К",
        "name": "Печений з капустою",
        "description": "Капуста, морква, спеції і тонка золотиста скоринка.",
        "price": 36,
        "tags": ["печений"],
        "featured": False,
    },
    {
        "id": "cheese-baked",
        "category": "baked",
        "mark": "С",
        "name": "Пиріжок з сиром",
        "description": "Домашній сир, трохи ванілі, теплий і не надто солодкий.",
        "price": 42,
        "tags": ["солодкий"],
        "featured": True,
    },
    {
        "id": "cherry-baked",
        "category": "baked",
        "mark": "В",
        "name": "Пиріжок з вишнею",
        "description": "Вишня у власному соку, щільна начинка без штучного присмаку.",
        "price": 44,
        "tags": ["солодкий", "печений"],
        "featured": False,
    },
    {
        "id": "mushroom-fried",
        "category": "fried",
        "mark": "Г",
        "name": "Пиріжок з грибами",
        "description": "Печериці, цибуля, зелень і тепла крафтова подача.",
        "price": 46,
        "tags": ["новинка"],
        "featured": False,
    },
    {
        "id": "lunch-set",
        "category": "sets",
        "mark": "2",
        "name": "Набір 2+напій",
        "description": "Два пиріжки на вибір і фільтр-кава або узвар.",
        "price": 109,
        "tags": ["вигідно"],
        "featured": True,
    },
    {
        "id": "family-set",
        "category": "sets",
        "mark": "6",
        "name": "Пакет для своїх",
        "description": "Шість пиріжків у крафтовому пакеті для дому або офісу.",
        "price": 229,
        "tags": ["крафт пакет"],
        "featured": False,
    },
    {
        "id": "coffee",
        "category": "drinks",
        "mark": "К",
        "name": "Фільтр-кава",
        "description": "Крафтовий стакан, чорна кришка, без сиропів і зайвого декору.",
        "price": 39,
        "tags": ["гарячий напій"],
        "featured": False,
    },
    {
        "id": "uzvar",
        "category": "drinks",
        "mark": "У",
        "name": "Домашній узвар",
        "description": "Сухофрукти, натуральний смак, пляшка 330 мл.",
        "price": 35,
        "tags": ["холодний напій"],
        "featured": False,
    },
]

PRODUCT_DETAILS = {
    "potato-fried": {
        "weight": "95 г",
        "kcal": "214 ккал",
        "ingredients": ["пшеничне тісто", "картопля", "цибуля", "олія", "чорний перець"],
        "allergens": ["глютен"],
    },
    "meat-fried": {
        "weight": "105 г",
        "kcal": "268 ккал",
        "ingredients": ["пшеничне тісто", "курка", "яловичина", "цибуля", "перець"],
        "allergens": ["глютен"],
    },
    "cabbage-baked": {
        "weight": "98 г",
        "kcal": "198 ккал",
        "ingredients": ["пшеничне тісто", "капуста", "морква", "олія", "спеції"],
        "allergens": ["глютен"],
    },
    "cheese-baked": {
        "weight": "100 г",
        "kcal": "236 ккал",
        "ingredients": ["пшеничне тісто", "домашній сир", "ваніль", "цукор"],
        "allergens": ["глютен", "молоко"],
    },
    "cherry-baked": {
        "weight": "102 г",
        "kcal": "224 ккал",
        "ingredients": ["пшеничне тісто", "вишня", "цукор", "крохмаль"],
        "allergens": ["глютен"],
    },
    "mushroom-fried": {
        "weight": "100 г",
        "kcal": "246 ккал",
        "ingredients": ["пшеничне тісто", "печериці", "цибуля", "зелень", "олія"],
        "allergens": ["глютен"],
    },
    "lunch-set": {
        "weight": "2 пиріжки + 250 мл",
        "kcal": "від 430 ккал",
        "ingredients": ["2 пиріжки на вибір", "фільтр-кава або узвар", "крафтове пакування"],
        "allergens": ["залежить від вибору пиріжків"],
    },
    "family-set": {
        "weight": "6 пиріжків",
        "kcal": "від 1180 ккал",
        "ingredients": ["6 пиріжків на вибір", "крафтовий пакет", "брендова вкладка"],
        "allergens": ["залежить від вибору пиріжків"],
    },
    "coffee": {
        "weight": "250 мл",
        "kcal": "5 ккал",
        "ingredients": ["арабіка", "вода"],
        "allergens": ["немає"],
    },
    "uzvar": {
        "weight": "330 мл",
        "kcal": "96 ккал",
        "ingredients": ["сухофрукти", "вода", "мед", "лимон"],
        "allergens": ["мед"],
    },
}

PROMOS = [
    {
        "id": "svoi10",
        "title": "Свої -10%",
        "text": "Знижка на перше замовлення у застосунку. Працює для самовивозу і доставки.",
        "code": "SVOI10",
        "discount": 10,
        "min_subtotal": 0,
    },
    {
        "id": "ranok",
        "title": "Ранковий набір",
        "text": "Пиріжок з сиром + фільтр-кава до 11:00 за спеціальною ціною.",
        "code": "RANOK",
        "discount": 12,
        "min_subtotal": 80,
    },
    {
        "id": "office",
        "title": "Пакет в офіс",
        "text": "При замовленні від 6 пиріжків додаємо крафтове пакування без доплати.",
        "code": "OFFICE",
        "discount": 5,
        "min_subtotal": 180,
    },
]


def seed_if_empty() -> None:
    conn = get_connection()
    has_menu = conn.execute("SELECT 1 FROM menu_items LIMIT 1").fetchone()
    if has_menu:
        return

    for city in CITIES:
        conn.execute(
            """
            INSERT INTO cities (id, name, delivery_fee, free_delivery_from, delivery_eta)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                city["id"],
                city["name"],
                city["delivery_fee"],
                city["free_delivery_from"],
                city["delivery_eta"],
            ),
        )
        for branch in city["branches"]:
            conn.execute(
                """
                INSERT INTO branches (id, city_id, name, address, phone, hours, pickup_eta)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    branch["id"],
                    city["id"],
                    branch["name"],
                    branch["address"],
                    branch["phone"],
                    branch["hours"],
                    branch["pickup_eta"],
                ),
            )

    for item in MENU_ITEMS:
        conn.execute(
            """
            INSERT INTO menu_items (id, category, mark, name, description, price, tags, featured, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                item["id"],
                item["category"],
                item["mark"],
                item["name"],
                item["description"],
                item["price"],
                dumps_json(item["tags"]),
                int(item["featured"]),
                item.get("image", ""),
            ),
        )

    for item_id, details in PRODUCT_DETAILS.items():
        conn.execute(
            """
            INSERT INTO product_details (menu_item_id, weight, kcal, ingredients, allergens)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                item_id,
                details["weight"],
                details["kcal"],
                dumps_json(details["ingredients"]),
                dumps_json(details["allergens"]),
            ),
        )

    for promo in PROMOS:
        conn.execute(
            """
            INSERT INTO promos (id, title, text, code, discount, min_subtotal)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                promo["id"],
                promo["title"],
                promo["text"],
                promo["code"],
                promo["discount"],
                promo["min_subtotal"],
            ),
        )

    conn.commit()