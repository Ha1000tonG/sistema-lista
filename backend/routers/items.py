# backend/routers/items.py lida com operações CRUD para itens de conteúdo
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import database, schemas, models, auth

router = APIRouter(prefix="/items", tags=['Items'])


@router.post("/", response_model=schemas.ContentItem, status_code=status.HTTP_201_CREATED)
def create_item(item: schemas.ContentItemCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_item = models.ContentItem(**item.dict(), owner_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


# --- ROTA CORRIGIDA: AGORA PROTEGIDA E FILTRA PELO DONO ---

#  Adicionado parâmetro opcional item_type para filtrar por tipo de item de conteúdo
@router.get("/", response_model=List[schemas.ContentItem])
def read_items(
    db: Session = Depends(database.get_db),
    # <-- ADICIONADO: Força autenticação
    current_user: schemas.User = Depends(auth.get_current_user),
    skip: int = 0,
    limit: int = 100,
    item_type: Optional[str] = None
):
    # 1. Filtra primeiro pelo ID do usuário logado
    query = db.query(models.ContentItem).filter(
        models.ContentItem.owner_id == current_user.id
    )

    # 2. Em seguida, aplica o filtro de item_type, se fornecido
    if item_type:
        query = query.filter(models.ContentItem.item_type == item_type)

    items = query.offset(skip).limit(limit).all()
    return items

# --- ROTA DE LEITURA DE ITEM POR ID --- ADICIONADA --- COM VERIFICAÇÃO DE POSSE --- 
@router.get("/{item_id}", response_model=schemas.ContentItem)
def read_item(item_id: int, db: Session = Depends(database.get_db)):
    db_item = db.query(models.ContentItem).filter(
        models.ContentItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")
    return db_item


@router.put("/{item_id}", response_model=schemas.ContentItem)
def update_item(item_id: int, item_update: schemas.ContentItemCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_item = db.query(models.ContentItem).filter(
        models.ContentItem.id == item_id).first()

    if db_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")
    # --- VERIFICAÇÃO DE POSSE ADICIONADA ---
    if db_item.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Não tem permissão para editar este item")

    update_data = item_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

# --- ROTA DELETAR ITEM COM VERIFICAÇÃO DE POSSE ADICIONADA  ---
@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_item = db.query(models.ContentItem).filter(
        models.ContentItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")

    # --- VERIFICAÇÃO DE POSSE ADICIONADA ---
    if db_item.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Não tem permissão para excluir este item")

    db.delete(db_item)
    db.commit()
    return

# --- NOVA ROTA PARA TRANSFERÊNCIA DE POSSE ---
@router.patch("/{item_id}/transfer/{new_owner_id}", response_model=schemas.ContentItem)
def transfer_item_ownership(item_id: int, new_owner_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    # 1. Busca o item
    db_item = db.query(models.ContentItem).filter(
        models.ContentItem.id == item_id).first()

    if db_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")

    # 2. Verifica a permissão (Apenas o dono atual pode transferir)
    if db_item.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Não tem permissão para transferir a posse deste item")

    # 3. Verifica se o novo proprietário existe
    new_owner = db.query(models.User).filter(
        models.User.id == new_owner_id).first()

    if new_owner is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Novo proprietário (ID) não encontrado")

    # 4. Atualiza a posse
    db_item.owner_id = new_owner_id
    db.commit()
    db.refresh(db_item)

    return db_item
