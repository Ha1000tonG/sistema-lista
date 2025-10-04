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

# --- NOVA ROTA DE EXCLUSÃO DE USUÁRIO ---
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    # 1. Busca o usuário
    user_to_delete = db.query(models.User).filter(
        models.User.id == user_id).first()

    if user_to_delete is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    # 2. Verifica se o usuário logado está tentando deletar a si mesmo
    if user_to_delete.id != current_user.id:
        # Em um sistema de produção, você adicionaria aqui uma verificação
        # de permissão de Administrador. Por enquanto, só permite a auto-deleção.
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Não tem permissão para excluir este usuário")

    # 3. Deleta o usuário. A exclusão em cascata cuidará dos cartões.
    db.delete(user_to_delete)
    db.commit()

    # Opcional: Se a exclusão for bem-sucedida, force o logout do usuário
    # removendo o token no front-end após a chamada.

    return
