from pydantic import BaseModel, Field


class PromotionBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = ""
    is_active: bool = True


class PromotionCreate(PromotionBase):
    pass


class PromotionUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    is_active: bool | None = None


class PromotionResponse(PromotionBase):
    id: int

    model_config = {"from_attributes": True}