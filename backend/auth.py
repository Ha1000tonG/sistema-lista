# backend/auth.py lida com autenticação e autorização
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from . import schemas, database, models
from .config import settings

# Configurações do JWT a partir das settings
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

# Configuração do PassLib (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def _normalize_password(password: str) -> str:
    """
    Normaliza a senha para garantir truncamento consistente em até 72 bytes (limite do bcrypt)
    e sempre retornar uma string decodificada válida.
    Esse processo deve ser aplicado tanto no hash quanto na verificação para evitar discrepâncias.
    """
    if password is None:
        return ""
    if isinstance(password, bytes):
        # decodifica bytes para str tentando UTF-8 (ignora erros)
        password = password.decode("utf-8", errors="ignore")
    # converte para bytes, trunca em 72 bytes e decodifica ignorando cortes de multi-byte
    pw_bytes = password.encode("utf-8")
    truncated = pw_bytes[:72]
    return truncated.decode("utf-8", errors="ignore")


def get_password_hash(password: str) -> str:
    """
    Retorna o hash da senha (usando truncamento consistente).
    """
    normalized = _normalize_password(password)
    return pwd_context.hash(normalized)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica a senha comparando o plain_password (após normalização)
    com o hashed_password armazenado.
    """
    normalized = _normalize_password(plain_password)
    return pwd_context.verify(normalized, hashed_password)


def create_access_token(data: dict):
    """
    Cria um JWT com expiração configurada em settings.
    O parâmetro 'data' deve conter as claims desejadas (ex.: {'sub': username}).
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + \
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    """
    Dependência para recuperar o usuário atual a partir do token Bearer.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(
        models.User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user
