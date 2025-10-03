# backend/routers/users.py lida com operações CRUD para usuários
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import database, schemas, models, auth

router = APIRouter(prefix="/users", tags=['Users'])


@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # --- LÓGICA DE VERIFICAÇÃO ADICIONADA ---
    db_user_check = db.query(models.User).filter(
        models.User.username == user.username).first()
    if db_user_check:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username já registrado")
    # ----------------------------------------

    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username,
                          hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/me/", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user
