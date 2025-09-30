# backend/models.py

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .database import Base


class ContentItem(Base):
    __tablename__ = "content_items"

    id = Column(Integer, primary_key=True, index=True)

    item_type = Column(String, index=True, nullable=False)

    # --- CAMPO ADICIONADO ---
    # Define a coluna para o status do Kanban, com um valor padrão.
    status = Column(String, default="A Fazer", index=True, nullable=False)

    title = Column(String, index=True, nullable=False)
    content = Column(String, nullable=False)

    image_url = Column(String, nullable=True)
    tags = Column(String, nullable=True)

    link_1_url = Column(String, nullable=True)
    link_1_text = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# A classe User permanece a mesma


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
