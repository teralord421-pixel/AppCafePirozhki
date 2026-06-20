from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class PromoCode(Base):
    __tablename__ = "promo_codes"

    id: Mapped[str] = mapped_column(String(48), primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    text: Mapped[str] = mapped_column(Text, default="")
    code: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    discount: Mapped[int] = mapped_column(Integer, nullable=False)
    min_subtotal: Mapped[int] = mapped_column(Integer, default=0)