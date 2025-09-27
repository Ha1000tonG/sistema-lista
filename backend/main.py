# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

from . import models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ENDPOINTS GENÉRICOS ---

@app.post("/items/", response_model=schemas.ContentItem, status_code=status.HTTP_201_CREATED)
def create_item(item: schemas.ContentItemCreate, db: Session = Depends(get_db)):
    db_item = models.ContentItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/items/", response_model=List[schemas.ContentItem])
def read_items(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    item_type: Optional[str] = None
):
    query = db.query(models.ContentItem)
    if item_type:
        query = query.filter(models.ContentItem.item_type == item_type)
    items = query.offset(skip).limit(limit).all()
    return items

@app.get("/items/{item_id}", response_model=schemas.ContentItem)
def read_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.ContentItem).filter(models.ContentItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")
    return db_item

@app.put("/items/{item_id}", response_model=schemas.ContentItem)
def update_item(item_id: int, item_update: schemas.ContentItemCreate, db: Session = Depends(get_db)):
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
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.ContentItem).filter(models.ContentItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")

    db.delete(db_item)
    db.commit()
    return