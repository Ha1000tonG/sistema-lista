# backend/main.py é o ponto de entrada da aplicação FastAPI

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from .database import engine
from . import models
from .routers import items, users, auth

# 1. Cria as tabelas no banco de dados ANTES de tudo.
#    Isso garante que, quando a API iniciar, o banco de dados já esteja pronto.
models.Base.metadata.create_all(bind=engine)

# 2. Cria a instância principal da aplicação.
app = FastAPI()

# 3. Adiciona o middleware de CORS como a primeira camada da aplicação.
#    Isso é crucial para que ele processe TODAS as requisições que chegam.
origins = [
    "http://localhost:5173",           # Para desenvolvimento local
    "https://kanban-hamilton.vercel.app"  # Para produção
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

# 4. Inclui os roteadores (os endpoints de /users, /items, /token)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(items.router)

# 5. Define o endpoint da rota raiz


@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")

# 4. Define o endpoint raiz


@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")


# 5. A criação das tabelas do banco de dados (é uma boa prática movê-la para depois da definição do app)
#    Isso garante que a aplicação esteja configurada antes de qualquer operação de I/O.
models.Base.metadata.create_all(bind=engine)






# Adicione este código ao final de backend/main.py

@app.get("/debug-db-path")
def debug_db_path():
    """
    Endpoint temporário para depuração. Retorna o caminho exato
    do banco de dados que a aplicação está usando.
    """
    from .config import settings
    # Retorna a variável DATABASE_URL que está sendo usada no momento
    return {"database_url_in_use": settings.DATABASE_URL}
