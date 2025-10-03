# backend/config.py carrega a configuração do banco de dados
import os
from pydantic_settings import BaseSettings, SettingsConfigDict

# Pega o caminho absoluto do diretório onde este arquivo (config.py) está
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define o caminho para o arquivo do banco de dados DENTRO da pasta backend
DB_PATH = os.path.join(BASE_DIR, "content_api.db")

# --- MUDANÇA PRINCIPAL AQUI: Define uma variável local para o DB SQLite ---
LOCAL_SQLITE_URL = f"sqlite:///{DB_PATH}"


class Settings(BaseSettings):
    # A URL do banco de dados agora tem o SQLite como padrão.
    # O valor será sobrescrito se uma variável de ambiente (do Render/Vercel)
    # ou o .env for carregado com um valor diferente (o que é bom para a produção).
    DATABASE_URL: str = LOCAL_SQLITE_URL

    # É fundamental usar uma variável de ambiente para distinguir entre
    # o modo de desenvolvimento e o de produção, caso o DB_URL seja sempre definido.
    # Se esta variável não existir, assumimos que estamos em desenvolvimento.
    ENVIRONMENT: str = "local"  # Valor padrão é 'local'

    SECRET_KEY: str = "SUA_CHAVE_SECRETA_MUITO_LONGA_E_SEGURA"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # O Pydantic irá procurar o .env da raiz.
    model_config = SettingsConfigDict(env_file=".env")


class LocalSettings(Settings):
    """
    Subclasse usada apenas para garantir o uso do SQLite LOCAL.
    Ela ignora o carregamento de qualquer variável de ambiente ou .env
    para o campo DATABASE_URL, forçando o uso do padrão LOCAL_SQLITE_URL.
    """

    # 1. Sobrescreve a configuração de BaseSettings
    model_config = SettingsConfigDict(
        # Remove env_file para esta subclasse. Você pode usar uma
        # Source personalizada, mas esta é a mais simples.
        env_file=None
    )

    # 2. Garante que o valor padrão seja sempre o LOCAL_SQLITE_URL
    DATABASE_URL: str = LOCAL_SQLITE_URL


# --- APLICAÇÃO DA LÓGICA DE AMBIENTE ---
# Se a variável de ambiente 'RENDER' ou similar estiver definida (ou se ENVIRONMENT for 'production'),
# usamos a classe Settings padrão que permite o override.
# Caso contrário, usamos a classe LocalSettings que força o SQLite.

# Para simplificar, vamos forçar o ambiente local a menos que o ENVIRONMENT seja 'production'
# e a DATABASE_URL já esteja definida no ambiente (e não no .env).

# Se você *só* quer o local, simplesmente use:
settings = LocalSettings()
# OU, se quer que o modo 'local' use o .env para a SECRET_KEY, mas não para o DB_URL:

# Verifica se o modo 'local' está forçado pelo ambiente
# Nota: o '.env' já foi carregado em 'Settings()', mas podemos usar a classe base
# para pegar a SECRET_KEY e forçar o DB_URL localmente.
try:
    # Tenta carregar as configurações do jeito que o FastAPI faria
    base_settings = Settings()

    # Se a variável ENVIRONMENT não foi sobrescrita (continua 'local')
    # e não estiver em ambiente de nuvem, força o DB local.
    if base_settings.ENVIRONMENT == "local" and 'RENDER' not in os.environ:
        settings = LocalSettings()
    else:
        # Se ENVIRONMENT foi definido como 'production' ou estamos no RENDER/Vercel
        settings = base_settings

except Exception:
    # Em caso de falha de carregamento, garante que o SQLite local seja o fallback
    settings = LocalSettings()
