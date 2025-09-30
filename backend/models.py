# backend/models.py

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .database import Base


class ContentItem(Base):
    __tablename__ = "content_items"

    id = Column(Integer, primary_key=True, index=True)

    # O campo chave para flexibilidade
    # Ex: "portfolio", "blog_post", "testimonial"
    item_type = Column(String, index=True, nullable=False)

    # Campos principais
    title = Column(String, index=True, nullable=False)
    content = Column(String, nullable=False)

    # Campos opcionais para enriquecer o conteúdo
    image_url = Column(String, nullable=True)
    tags = Column(String, nullable=True)  # Ex: "React, FastAPI, Python"

    # Links genéricos
    link_1_url = Column(String, nullable=True)
    link_1_text = Column(String, nullable=True)  # Ex: "GitHub Repo"

    # Datas de controle
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    from sqlalchemy import Column, Integer, String


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
