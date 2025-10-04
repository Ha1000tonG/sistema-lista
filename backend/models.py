# backend/models.py define os modelos de banco de dados usando SQLAlchemy

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# Definição dos Modelos de Banco de Dados usando SQLAlchemy ORM
class ContentItem(Base):
    __tablename__ = "content_items"
    id = Column(Integer, primary_key=True, index=True)
    item_type = Column(String, index=True, nullable=False)
    status = Column(String, default="A Fazer", index=True, nullable=False)
    title = Column(String, index=True, nullable=False)
    content = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    tags = Column(String, nullable=True)
    link_1_url = Column(String, nullable=True)
    link_1_text = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    owner = relationship("User", backref="items", cascade="all, delete")

# Modelo de Usuário para autenticação e autorização simples (para fins de demonstração)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
