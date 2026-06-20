import enum
import time
from datetime import datetime

from sqlalchemy import BigInteger, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base


class OrderStatus(str, enum.Enum):
    NEW = "new"
    COOKING = "cooking"
    READY = "ready"
    DONE = "done"
    CANCELED = "canceled"


class OrderType(str, enum.Enum):
    PICKUP = "pickup"
    DELIVERY = "delivery"


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(16), primary_key=True)
    city_id: Mapped[str] = mapped_column(ForeignKey("cities.id"), index=True)
    branch_id: Mapped[str] = mapped_column(ForeignKey("branches.id"), index=True)
    order_type: Mapped[OrderType] = mapped_column(nullable=False)
    status: Mapped[OrderStatus] = mapped_column(default=OrderStatus.NEW, index=True)
    total: Mapped[int] = mapped_column(Integer, default=0)
    promo_code: Mapped[str] = mapped_column(String(32), default="")
    bonus_discount: Mapped[int] = mapped_column(Integer, default=0)
    items_count: Mapped[int] = mapped_column(Integer, default=0)
    eta: Mapped[str] = mapped_column(String(32), default="")
    scheduled_time: Mapped[str] = mapped_column(String(32), default="")
    payment: Mapped[str] = mapped_column(String(64), default="")
    address: Mapped[str] = mapped_column(String(200), default="")
    apartment: Mapped[str] = mapped_column(String(64), default="")
    customer_name: Mapped[str] = mapped_column(String(120), default="")
    customer_phone: Mapped[str] = mapped_column(String(32), default="")
    created_at_ms: Mapped[int] = mapped_column(BigInteger, default=lambda: int(time.time() * 1000))
    created_at: Mapped[str] = mapped_column(String(32), default="")
    client_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    worker_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)

    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    client = relationship("User", back_populates="client_orders", foreign_keys=[client_id])
    worker = relationship("User", back_populates="worker_orders", foreign_keys=[worker_id])

    @staticmethod
    def make_id() -> str:
        return f"LAB-{str(int(time.time() * 1000))[-6:]}"

    @staticmethod
    def make_created_at() -> str:
        return datetime.now().strftime("%d.%m, %H:%M")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    order_id: Mapped[str] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), index=True)
    menu_item_id: Mapped[str] = mapped_column(ForeignKey("menu_items.id"))
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[int] = mapped_column(Integer, nullable=False)

    order: Mapped["Order"] = relationship(back_populates="items")