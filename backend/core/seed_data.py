CITIES = [
    {
        "id": "kyiv",
        "name": "Київ",
        "delivery_fee": 49,
        "free_delivery_from": 300,
        "delivery_eta": "25-35 хв",
        "branches": [
            {"id": "kyiv-podil", "name": "Поділ", "address": "вул. Нижній Вал 18", "phone": "+380 67 110 18 18", "hours": "08:00-21:00", "pickup_eta": "7-10 хв"},
            {"id": "kyiv-pozniaky", "name": "Позняки", "address": "просп. Григоренка 22", "phone": "+380 67 110 22 22", "hours": "08:00-22:00", "pickup_eta": "8-12 хв"},
        ],
    },
    {
        "id": "lviv",
        "name": "Львів",
        "delivery_fee": 45,
        "free_delivery_from": 280,
        "delivery_eta": "25-35 хв",
        "branches": [
            {"id": "lviv-halytskyi", "name": "Галицька", "address": "вул. Братів Рогатинців 9", "phone": "+380 67 210 09 09", "hours": "08:00-21:00", "pickup_eta": "8-12 хв"},
            {"id": "lviv-sykhiv", "name": "Сихів", "address": "просп. Червоної Калини 60", "phone": "+380 67 210 60 60", "hours": "09:00-21:00", "pickup_eta": "9-13 хв"},
        ],
    },
    {
        "id": "odesa",
        "name": "Одеса",
        "delivery_fee": 55,
        "free_delivery_from": 320,
        "delivery_eta": "30-40 хв",
        "branches": [
            {"id": "odesa-center", "name": "Центр", "address": "вул. Дерибасівська 14", "phone": "+380 67 310 14 14", "hours": "08:00-22:00", "pickup_eta": "10-15 хв"},
            {"id": "odesa-tairova", "name": "Таїрова", "address": "вул. Академіка Корольова 72", "phone": "+380 67 310 72 72", "hours": "09:00-21:00", "pickup_eta": "10-14 хв"},
        ],
    },
    {
        "id": "dnipro",
        "name": "Дніпро",
        "delivery_fee": 50,
        "free_delivery_from": 300,
        "delivery_eta": "25-35 хв",
        "branches": [
            {"id": "dnipro-center", "name": "Центр", "address": "вул. Короленка 3", "phone": "+380 67 410 03 03", "hours": "08:00-21:00", "pickup_eta": "9-13 хв"},
            {"id": "dnipro-peremoha", "name": "Перемога", "address": "наб. Перемоги 86", "phone": "+380 67 410 86 86", "hours": "09:00-21:00", "pickup_eta": "10-14 хв"},
        ],
    },
]

MENU_ITEMS = [
    {"id": "potato-fried", "category": "fried", "mark": "К", "name": "Пиріжок з картоплею", "description": "Смажений, м'яке тісто, картопля з цибулею і легким перцем.", "price": 34, "tags": ["хіт", "вегетаріанський"], "featured": True},
    {"id": "meat-fried", "category": "fried", "mark": "М", "name": "Пиріжок з м'ясом", "description": "Соковита начинка з курки та яловичини.", "price": 48, "tags": ["ситний", "гарячий"], "featured": True},
    {"id": "cabbage-baked", "category": "baked", "mark": "К", "name": "Печений з капустою", "description": "Капуста, морква, спеції і тонка золотиста скоринка.", "price": 36, "tags": ["печений"], "featured": False},
    {"id": "cheese-baked", "category": "baked", "mark": "С", "name": "Пиріжок з сиром", "description": "Домашній сир, трохи ванілі.", "price": 42, "tags": ["солодкий"], "featured": True},
    {"id": "cherry-baked", "category": "baked", "mark": "В", "name": "Пиріжок з вишнею", "description": "Вишня у власному соку.", "price": 44, "tags": ["солодкий", "печений"], "featured": False},
    {"id": "mushroom-fried", "category": "fried", "mark": "Г", "name": "Пиріжок з грибами", "description": "Печериці, цибуля, зелень.", "price": 46, "tags": ["новинка"], "featured": False},
    {"id": "lunch-set", "category": "sets", "mark": "2", "name": "Набір 2+напій", "description": "Два пиріжки на вибір і фільтр-кава або узвар.", "price": 109, "tags": ["вигідно"], "featured": True},
    {"id": "family-set", "category": "sets", "mark": "6", "name": "Пакет для своїх", "description": "Шість пиріжків у крафтовому пакеті.", "price": 229, "tags": ["крафт пакет"], "featured": False},
    {"id": "coffee", "category": "drinks", "mark": "К", "name": "Фільтр-кава", "description": "Крафтовий стакан, чорна кришка.", "price": 39, "tags": ["гарячий напій"], "featured": False},
    {"id": "uzvar", "category": "drinks", "mark": "У", "name": "Домашній узвар", "description": "Сухофрукти, натуральний смак, 330 мл.", "price": 35, "tags": ["холодний напій"], "featured": False},
]

PRODUCT_DETAILS = {
    "potato-fried": {"weight": "95 г", "kcal": "214 ккал", "ingredients": ["пшеничне тісто", "картопля", "цибуля"], "allergens": ["глютен"]},
    "meat-fried": {"weight": "105 г", "kcal": "268 ккал", "ingredients": ["пшеничне тісто", "курка", "яловичина"], "allergens": ["глютен"]},
    "cabbage-baked": {"weight": "98 г", "kcal": "198 ккал", "ingredients": ["пшеничне тісто", "капуста", "морква"], "allergens": ["глютен"]},
    "cheese-baked": {"weight": "100 г", "kcal": "236 ккал", "ingredients": ["пшеничне тісто", "домашній сир"], "allergens": ["глютен", "молоко"]},
    "cherry-baked": {"weight": "102 г", "kcal": "224 ккал", "ingredients": ["пшеничне тісто", "вишня"], "allergens": ["глютен"]},
    "mushroom-fried": {"weight": "100 г", "kcal": "246 ккал", "ingredients": ["пшеничне тісто", "печериці"], "allergens": ["глютен"]},
    "lunch-set": {"weight": "2 пиріжки + 250 мл", "kcal": "від 430 ккал", "ingredients": ["2 пиріжки", "напій"], "allergens": ["залежить від вибору"]},
    "family-set": {"weight": "6 пиріжків", "kcal": "від 1180 ккал", "ingredients": ["6 пиріжків", "крафтовий пакет"], "allergens": ["залежить від вибору"]},
    "coffee": {"weight": "250 мл", "kcal": "5 ккал", "ingredients": ["арабіка", "вода"], "allergens": ["немає"]},
    "uzvar": {"weight": "330 мл", "kcal": "96 ккал", "ingredients": ["сухофрукти", "вода"], "allergens": ["мед"]},
}

PROMO_CODES = [
    {"id": "svoi10", "title": "Свої -10%", "text": "Знижка на перше замовлення у застосунку.", "code": "SVOI10", "discount": 10, "min_subtotal": 0},
    {"id": "ranok", "title": "Ранковий набір", "text": "Пиріжок з сиром + кава до 11:00.", "code": "RANOK", "discount": 12, "min_subtotal": 80},
    {"id": "office", "title": "Пакет в офіс", "text": "При замовленні від 6 пиріжків — крафт пакування.", "code": "OFFICE", "discount": 5, "min_subtotal": 180},
]

PROMOTIONS = [
    ("Скидка 10%", "Скидка 10% на все заказы до конца месяца", True),
    ("Бесплатный кофе", "Бесплатный кофе при заказе от 500 грн", False),
]