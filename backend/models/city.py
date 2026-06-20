from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base


class City(Base):
    __tablename__ = "cities"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    name: Mapped[str] = mapped_column(String(64), nullable=False)
    delivery_fee: Mapped[int] = mapped_column(Integer, default=0)
    free_delivery_from: Mapped[int] = mapped_column(Integer, default=0)
    delivery_eta: Mapped[str] = mapped_column(String(32), default="")

    branches: Mapped[list["Branch"]] = relationship(back_populates="city", cascade="all, delete-orphan")


class Branch(Base):
    __tablename__ = "branches"

    id: Mapped[str] = mapped_column(String(48), primary_key=True)
    city_id: Mapped[str] = mapped_column(ForeignKey("cities.id"), index=True)
    name: Mapped[str] = mapped_column(String(64), nullable=False)
    address: Mapped[str] = mapped_column(String(200), default="")
    phone: Mapped[str] = mapped_column(String(32), default="")
    hours: Mapped[str] = mapped_column(String(32), default="")
    pickup_eta: Mapped[str] = mapped_column(String(32), default="")

    city: Mapped["City"] = relationship(back_populates="branches")