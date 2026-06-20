from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base


class MenuItem(Base):
    __tablename__ = "menu_items"

    id: Mapped[str] = mapped_column(String(48), primary_key=True)
    category: Mapped[str] = mapped_column(String(32), nullable=False)
    mark: Mapped[str] = mapped_column(String(8), default="")
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    tags: Mapped[list] = mapped_column(JSONB, default=list)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    image: Mapped[str] = mapped_column(Text, default="")

    details: Mapped["ProductDetail | None"] = relationship(
        back_populates="menu_item", uselist=False, cascade="all, delete-orphan"
    )


class ProductDetail(Base):
    __tablename__ = "product_details"

    menu_item_id: Mapped[str] = mapped_column(ForeignKey("menu_items.id"), primary_key=True)
    weight: Mapped[str] = mapped_column(String(64), default="")
    kcal: Mapped[str] = mapped_column(String(64), default="")
    ingredients: Mapped[list] = mapped_column(JSONB, default=list)
    allergens: Mapped[list] = mapped_column(JSONB, default=list)

    menu_item: Mapped["MenuItem"] = relationship(back_populates="details")