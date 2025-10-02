# backend/test_db.py
import os
from sqlalchemy import (create_engine, Column, Integer, String,
                        DateTime, ForeignKey)
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

print("--- Iniciando o script de teste do banco de dados ---")

# Garante que estamos no diretório correto
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "test_database.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

print(f"Caminho do banco de dados que será criado: {SQLALCHEMY_DATABASE_URL}")

# Apaga o banco de dados de teste antigo, se existir, para garantir um teste limpo
if os.path.exists(DB_PATH):
    os.remove(DB_PATH)
    print("--- Banco de dados de teste antigo removido. ---")

# Definição do SQLAlchemy
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
Base = declarative_base()

# --- Definição dos Modelos (copiado do seu models.py) ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

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
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User")

# --- Ação Principal ---
try:
    print("\n--- Tentando criar as tabelas... ---")
    Base.metadata.create_all(bind=engine)
    print("--- SUCESSO! Tabelas criadas sem erro de 'tabela já definida'. ---")
except Exception as e:
    print("\n--- FALHA AO CRIAR AS TABELAS! ---")
    print(f"Ocorreu um erro: {e}")