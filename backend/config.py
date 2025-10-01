# backend/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # A URL do banco de dados. Se a variável de ambiente não for definida,
    # usará o valor padrão do SQLite, garantindo que o ambiente local funcione.
    DATABASE_URL: str = "sqlite:///./content_api.db"

    # A chave secreta para o JWT. É crucial que ela seja definida no ambiente de produção.
    SECRET_KEY: str = "SUA_CHAVE_SECRETA_MUITO_LONGA_E_SEGURA"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
