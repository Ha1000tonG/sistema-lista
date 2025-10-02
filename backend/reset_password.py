# backend/reset_password.py

from backend.database import SessionLocal
from backend import models, auth


def reset_password(username: str, new_password: str):
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(
            models.User.username == username).first()
        if not user:
            print(f"❌ Usuário '{username}' não encontrado.")
            return

        # Gera novo hash com a função corrigida
        user.hashed_password = auth.get_password_hash(new_password)
        db.commit()
        print(f"✅ Senha do usuário '{username}' atualizada com sucesso!")
    finally:
        db.close()


if __name__ == "__main__":
    # 🔧 Edite aqui para o usuário/senha desejados
    reset_password("Hamilton", "123")
