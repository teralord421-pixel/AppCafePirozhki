from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import hash_password
from core.seed_data import CITIES, MENU_ITEMS, PRODUCT_DETAILS, PROMO_CODES, PROMOTIONS
from models.city import Branch, City
from models.menu import MenuItem, ProductDetail
from models.promo_code import PromoCode
from models.promotion import Promotion
from models.user import User, UserRole

DEFAULT_USERS = [
    ("admin", "admin123", UserRole.ADMIN),
    ("worker1", "worker123", UserRole.WORKER),
    ("client1", "client123", UserRole.CLIENT),
]


async def seed_initial_data(db: AsyncSession) -> None:
    user_exists = await db.execute(select(User).limit(1))
    if user_exists.scalar_one_or_none() is None:
        for username, password, role in DEFAULT_USERS:
            db.add(User(username=username, password_hash=hash_password(password), role=role))

    city_exists = await db.execute(select(City).limit(1))
    if city_exists.scalar_one_or_none() is None:
        for city_data in CITIES:
            city = City(
                id=city_data["id"],
                name=city_data["name"],
                delivery_fee=city_data["delivery_fee"],
                free_delivery_from=city_data["free_delivery_from"],
                delivery_eta=city_data["delivery_eta"],
            )
            db.add(city)
            for branch_data in city_data["branches"]:
                db.add(
                    Branch(
                        id=branch_data["id"],
                        city_id=city_data["id"],
                        name=branch_data["name"],
                        address=branch_data["address"],
                        phone=branch_data["phone"],
                        hours=branch_data["hours"],
                        pickup_eta=branch_data["pickup_eta"],
                    )
                )

    menu_exists = await db.execute(select(MenuItem).limit(1))
    if menu_exists.scalar_one_or_none() is None:
        for item in MENU_ITEMS:
            menu_item = MenuItem(
                id=item["id"],
                category=item["category"],
                mark=item["mark"],
                name=item["name"],
                description=item["description"],
                price=item["price"],
                tags=item["tags"],
                featured=item["featured"],
                image=item.get("image", ""),
            )
            db.add(menu_item)
            details = PRODUCT_DETAILS.get(item["id"])
            if details:
                db.add(
                    ProductDetail(
                        menu_item_id=item["id"],
                        weight=details["weight"],
                        kcal=details["kcal"],
                        ingredients=details["ingredients"],
                        allergens=details["allergens"],
                    )
                )

    promo_exists = await db.execute(select(PromoCode).limit(1))
    if promo_exists.scalar_one_or_none() is None:
        for promo in PROMO_CODES:
            db.add(PromoCode(**promo))

    promotion_exists = await db.execute(select(Promotion).limit(1))
    if promotion_exists.scalar_one_or_none() is None:
        for title, description, is_active in PROMOTIONS:
            db.add(Promotion(title=title, description=description, is_active=is_active))

    await db.flush()