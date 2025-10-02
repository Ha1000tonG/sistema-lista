from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import models, database, auth

router = APIRouter()
# routers/auth.py (apenas para DEBUG local — remova em produção)


@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(
        models.User.username == form_data.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found",
                            headers={"WWW-Authenticate": "Bearer"})
    if not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password",
                            headers={"WWW-Authenticate": "Bearer"})

    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}




























# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordRequestForm
# from sqlalchemy.orm import Session
# from .. import models, database, auth

# router = APIRouter()


# @router.post("/token")
#def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
#    user = db.query(models.User).filter(
#        models.User.username == form_data.username).first()
#    if not user or not auth.verify_password(form_data.password, user.hashed_password):
#        raise HTTPException(
#            status_code=status.HTTP_401_UNAUTHORIZED,
#            detail="Incorrect username or password",
#            headers={"WWW-Authenticate": "Bearer"},
#        )
#
#    access_token = auth.create_access_token(data={"sub": user.username})
#    return {"access_token": access_token, "token_type": "bearer"}
