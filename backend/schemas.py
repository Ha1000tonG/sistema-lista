# backend/schemas.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ContentItemBase(BaseModel):
    item_type: str
    title: str
    content: str
    image_url: Optional[str] = None
    tags: Optional[str] = None
    link_1_url: Optional[str] = None
    link_1_text: Optional[str] = None


class ContentItemCreate(ContentItemBase):
    pass


class ContentItem(ContentItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
