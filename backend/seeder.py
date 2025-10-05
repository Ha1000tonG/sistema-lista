# backend/seeder.py

from sqlalchemy.orm import Session
from . import models, auth
from sqlalchemy import text

# 1. Dados iniciais para popular o banco de dados
# Dados do usuário inicial
ADMIN_USERNAME = "AdminDemo"
ADMIN_PASSWORD = "Password123"

# Dados dos cartões de demonstração
DEMO_CARDS = [
    {
        "item_type": "kanban_card",
        "title": "Configuração Final do Projeto",
        "content": "Verificar todas as variáveis de ambiente e garantir que o deploy esteja estável.",
        "tags": "Config, Backend",
        "status": "A Fazer"
    },
    {
        "item_type": "kanban_card",
        "title": "Teste de Posse e Transferência",
        "content": "Usar este cartão para testar a rota PATCH de transferência de dono.",
        "tags": "Segurança, Teste",
        "status": "Em Andamento"
    },
    {
        "item_type": "kanban_card",
        "title": "Documentação e Portfólio",
        "content": "Finalizar o Readme.md e preparar o post para o LinkedIn.",
        "tags": "UX, Portfólio",
        "status": "Concluído"
    },
]

# 2. Função para popular o banco de dados
def seed_db(db: Session):
    """Limpa o DB e insere o usuário AdminDemo e cartões."""

    # 1. Limpa todas as tabelas (importante para o Postgres)
    db.execute(text("DELETE FROM content_items"))
    db.execute(text("DELETE FROM users"))
    db.commit()

    # 2. Cria o Usuário AdminDemo
    hashed_password = auth.get_password_hash(ADMIN_PASSWORD)
    admin_user = models.User(username=ADMIN_USERNAME, hashed_password=hashed_password)
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

    # 3. Cria os cartões de demonstração para o AdminDemo
    for card_data in DEMO_CARDS:
        db_item = models.ContentItem(**card_data, owner_id=admin_user.id)
        db.add(db_item)

    db.commit()
    return admin_user