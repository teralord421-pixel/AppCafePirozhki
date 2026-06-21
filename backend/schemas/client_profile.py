from pydantic import BaseModel, Field


class ClientRegisterRequest(BaseModel):
    phone: str = Field(min_length=10, max_length=32)
    name: str = Field(default="", max_length=120)
    password: str = Field(min_length=4, max_length=128)
    birthday: str = Field(default="", max_length=32)


class ClientProfileUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=120, alias="displayName")
    phone: str | None = Field(default=None, max_length=32)
    birthday: str | None = Field(default=None, max_length=32)
    favorites: list[str] | None = None

    model_config = {"populate_by_name": True}


class ClientLoyaltyOut(BaseModel):
    spent_points: int = Field(alias="spentPoints")
    total_spent: int = Field(alias="totalSpent")
    earned_points: int = Field(alias="earnedPoints")
    points: int

    model_config = {"populate_by_name": True}


class ClientProfileOut(BaseModel):
    id: int
    username: str
    display_name: str = Field(alias="displayName")
    phone: str
    birthday: str
    favorites: list[str]
    loyalty: ClientLoyaltyOut

    model_config = {"populate_by_name": True}