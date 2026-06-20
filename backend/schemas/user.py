from pydantic import BaseModel, Field

from models.user import UserRole


class UserBase(BaseModel):
    username: str = Field(min_length=1, max_length=64)
    role: UserRole


class UserCreate(UserBase):
    password: str = Field(min_length=4, max_length=128)


class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=1, max_length=64)
    password: str | None = Field(default=None, min_length=4, max_length=128)
    role: UserRole | None = None


class UserResponse(UserBase):
    id: int

    model_config = {"from_attributes": True}