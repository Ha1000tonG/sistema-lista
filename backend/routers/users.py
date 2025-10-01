# backend/routers/users.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database, schemas, models, auth

router = APIRouter(prefix="/users", tags=['Users'])


@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username,
                          hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- ENDPOINT ADICIONADO ---
# Este endpoint retorna os dados do usuário que está logado.
@router.get("/me/", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    """
    Retorna os dados do usuário atualmente autenticado.
    """
    return current_user
