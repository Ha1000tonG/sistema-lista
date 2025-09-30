# backend/schemas.py

# Importe ConfigDict para Pydantic v2
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class ContentItemBase(BaseModel):
    item_type: str

    # --- CAMPO ADICIONADO ---
    # O status é opcional ao criar/atualizar, pois já tem um valor padrão no banco.
    status: Optional[str] = "A Fazer"

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

    # Atualizado para a sintaxe do Pydantic v2 que vimos no log de erro
    model_config = ConfigDict(from_attributes=True)

# Os schemas User, Token e TokenData permanecem os mesmos


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
