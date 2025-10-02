# backend/config.py
import os
from pydantic_settings import BaseSettings, SettingsConfigDict

# --- MUDANÇA PRINCIPAL AQUI ---

# Pega o caminho absoluto do diretório onde este arquivo (config.py) está
# __file__ se refere ao arquivo atual (config.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define o caminho para o arquivo do banco de dados DENTRO da pasta backend
DB_PATH = os.path.join(BASE_DIR, "content_api.db")


class Settings(BaseSettings):
    # A URL do banco de dados agora usa um caminho absoluto e inequívoco.
    DATABASE_URL: str = f"sqlite:///{DB_PATH}"

    # A chave secreta para o JWT. É crucial que ela seja definida no ambiente de produção.
    SECRET_KEY: str = "SUA_CHAVE_SECRETA_MUITO_LONGA_E_SEGURA"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
