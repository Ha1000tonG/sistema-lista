# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from .database import engine
from . import models
from .routers import items, users, auth

# Cria as tabelas no banco de dados
app = FastAPI()

origins = ["http://localhost:5173", # Para desenvolvimento local
           "https://kanban-hamilton.vercel.app"]  # Para produção
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cria as tabelas no banco de dados (se ainda não existirem) e conecta ao banco de dados SQLite local ou PostgreSQL remoto conforme a configuração do ambiente de execução (variável de ambiente)
models.Base.metadata.create_all(bind=engine)

# Inclui os roteadores
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(items.router)


@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")
