from pydantic import BaseModel, Field

from models.order import OrderStatus, OrderType
from schemas.catalog import OrderOutFull


class OrderAdminCreate(BaseModel):
    city_id: str = Field(alias="cityId")
    branch_id: str = Field(alias="branchId")
    order_type: OrderType = Field(default=OrderType.PICKUP, alias="orderType")
    status: OrderStatus = OrderStatus.NEW
    customer_name: str = Field(default="", alias="customerName")
    customer_phone: str = Field(default="", alias="customerPhone")
    worker_id: int | None = None

    model_config = {"populate_by_name": True, "extra": "ignore"}


class OrderAdminUpdate(BaseModel):
    status: OrderStatus | None = None
    worker_id: int | None = None


class OrderAdminResponse(BaseModel):
    id: str
    city_id: str
    branch_id: str
    order_type: OrderType
    status: OrderStatus
    total: int
    customer_name: str
    customer_phone: str
    worker_id: int | None
    client_id: int | None
    items_count: int

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    worker_id: int | None = None


class OrderUpdate(BaseModel):
    worker_id: int | None = None
    status: OrderStatus | None = None


class OrderResponse(OrderOutFull):
    pass