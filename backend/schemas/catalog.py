from typing import Literal

from pydantic import BaseModel, Field, field_validator

OrderType = Literal["pickup", "delivery"]
StaffStatus = Literal["new", "cooking", "ready", "done", "canceled"]
LegacyRole = Literal["customer", "worker", "admin"]


class BranchOut(BaseModel):
    id: str
    name: str
    address: str
    phone: str
    hours: str
    pickup_eta: str = Field(alias="pickupEta")

    model_config = {"populate_by_name": True}


class CityOut(BaseModel):
    id: str
    name: str
    delivery_fee: int = Field(alias="deliveryFee")
    free_delivery_from: int = Field(alias="freeDeliveryFrom")
    delivery_eta: str = Field(alias="deliveryEta")
    branches: list[BranchOut]

    model_config = {"populate_by_name": True}


class CityCreate(BaseModel):
    id: str | None = None
    name: str
    delivery_fee: int = Field(default=0, ge=0, alias="deliveryFee")
    free_delivery_from: int = Field(default=0, ge=0, alias="freeDeliveryFrom")
    delivery_eta: str = Field(default="", alias="deliveryEta")

    model_config = {"populate_by_name": True}


class CityUpdate(BaseModel):
    name: str | None = None
    delivery_fee: int | None = Field(default=None, ge=0, alias="deliveryFee")
    free_delivery_from: int | None = Field(default=None, ge=0, alias="freeDeliveryFrom")
    delivery_eta: str | None = Field(default=None, alias="deliveryEta")

    model_config = {"populate_by_name": True}


class BranchCreate(BaseModel):
    id: str | None = None
    city_id: str = Field(alias="cityId")
    name: str
    address: str = ""
    phone: str = ""
    hours: str = ""
    pickup_eta: str = Field(default="", alias="pickupEta")

    model_config = {"populate_by_name": True}


class BranchUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    phone: str | None = None
    hours: str | None = None
    pickup_eta: str | None = Field(default=None, alias="pickupEta")

    model_config = {"populate_by_name": True}


class ProductDetailsOut(BaseModel):
    weight: str
    kcal: str
    ingredients: list[str]
    allergens: list[str]


class MenuItemOut(BaseModel):
    id: str
    category: str
    mark: str
    name: str
    description: str
    price: int
    tags: list[str]
    featured: bool
    image: str = ""
    details: ProductDetailsOut | None = None


class MenuItemCreate(BaseModel):
    id: str | None = None
    category: str
    mark: str
    name: str
    description: str
    price: int = Field(ge=1)
    tags: list[str] = Field(default_factory=list)
    featured: bool = False
    image: str = ""
    weight: str = "уточнюйте на точці"
    kcal: str = "уточнюйте"
    ingredients: list[str] = Field(default_factory=list)
    allergens: list[str] = Field(default_factory=list)


class PromoOut(BaseModel):
    id: str
    title: str
    text: str
    code: str
    discount: int
    min_subtotal: int = Field(alias="minSubtotal")

    model_config = {"populate_by_name": True}


class PromotionCatalogOut(BaseModel):
    id: int
    title: str
    description: str


class PromoCreate(BaseModel):
    id: str | None = None
    title: str
    text: str
    code: str
    discount: int = Field(ge=1, le=90)
    min_subtotal: int = Field(default=0, ge=0, alias="minSubtotal")

    model_config = {"populate_by_name": True}

    @field_validator("code")
    @classmethod
    def normalize_code(cls, value: str) -> str:
        return value.strip().upper()


class CatalogOut(BaseModel):
    cities: list[CityOut]
    menu_items: list[MenuItemOut] = Field(alias="menuItems")
    product_details: dict[str, ProductDetailsOut] = Field(alias="productDetails")
    promos: list[PromoOut]
    promotions: list[PromotionCatalogOut] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class OrderItemIn(BaseModel):
    id: str
    quantity: int = Field(ge=1)


class OrderItemOut(BaseModel):
    id: str
    quantity: int
    unit_price: int = Field(alias="unitPrice")

    model_config = {"populate_by_name": True}


class OrderCustomerOut(BaseModel):
    name: str
    phone: str


class OrderCreateFull(BaseModel):
    city_id: str = Field(alias="cityId")
    branch_id: str = Field(alias="branchId")
    order_type: OrderType = Field(alias="orderType")
    items: list[OrderItemIn]
    promo_code: str = Field(default="", alias="promoCode")
    use_bonus: bool = Field(default=False, alias="useBonus")
    scheduled_time: str = Field(default="", alias="time")
    payment: str
    address: str = ""
    apartment: str = ""
    customer_name: str = Field(alias="customerName")
    customer_phone: str = Field(alias="customerPhone")

    model_config = {"populate_by_name": True}


class OrderOutFull(BaseModel):
    id: str
    city: str
    branch: str
    city_id: str = Field(alias="cityId")
    branch_id: str = Field(alias="branchId")
    order_type: OrderType = Field(alias="orderType")
    type_label: str = Field(alias="typeLabel")
    status: StaffStatus
    total: int
    promo_code: str = Field(alias="promoCode")
    bonus_discount: int = Field(alias="bonusDiscount")
    items_count: int = Field(alias="itemsCount")
    eta: str
    scheduled_time: str = Field(alias="time")
    payment: str
    address: str = ""
    apartment: str = ""
    items: list[OrderItemOut]
    created_at_ms: int = Field(alias="createdAtMs")
    created_at: str = Field(alias="createdAt")
    customer: OrderCustomerOut

    model_config = {"populate_by_name": True}


class OrderStatusUpdate(BaseModel):
    status: StaffStatus


class PinLoginRequest(BaseModel):
    role: LegacyRole
    pin: str = ""


class PinLoginResponse(BaseModel):
    token: str
    role: LegacyRole
    label: str