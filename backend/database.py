# backend/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# URL de conexão para o SQLite. O arquivo do banco será criado na mesma pasta com o nome blog.db
SQLALCHEMY_DATABASE_URL = "sqlite:///./content_api.db"

# O 'engine' é o ponto de entrada para o banco de dados
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Cada instância de SessionLocal será uma sessão com o banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Usaremos esta Base para criar cada um dos modelos do ORM (as tabelas do banco)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
