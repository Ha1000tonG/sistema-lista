# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse

# Importa os módulos necessários do nosso pacote 'backend'
# Corrigido para importar 'database' para ter acesso a tudo de lá
from . import auth, models, schemas, database

# Cria as tabelas no banco de dados usando o 'engine' do módulo database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Configuração do CORS
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPOINTS DE AUTENTICAÇÃO E USUÁRIO ---
# (Estes já estavam corretos, mas com a dependência de 'get_db' corrigida)

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


# --- ENDPOINTS DE CONTEÚDO (CRUD) ---
# (Versão unificada: rotas de escrita protegidas, rotas de leitura públicas)

@app.post("/items/", response_model=schemas.ContentItem, status_code=status.HTTP_201_CREATED)
def create_item(item: schemas.ContentItemCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_item = models.ContentItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/items/{item_id}", response_model=schemas.ContentItem)
def update_item(item_id: int, item_update: schemas.ContentItemCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_item = db.query(models.ContentItem).filter(models.ContentItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")

    update_data = item_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)

    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_item = db.query(models.ContentItem).filter(models.ContentItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")

    db.delete(db_item)
    db.commit()
    return

# Os endpoints de leitura GET continuam públicos
@app.get("/items/", response_model=List[schemas.ContentItem])
def read_items(db: Session = Depends(database.get_db), skip: int = 0, limit: int = 100, item_type: Optional[str] = None):
    query = db.query(models.ContentItem)
    if item_type:
        query = query.filter(models.ContentItem.item_type == item_type)
    items = query.offset(skip).limit(limit).all()
    return items

@app.get("/items/{item_id}", response_model=schemas.ContentItem)
def read_item(item_id: int, db: Session = Depends(database.get_db)):
    db_item = db.query(models.ContentItem).filter(models.ContentItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")
    return db_item


@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")
