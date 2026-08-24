from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.auth import issue_demo_token
from app.config import get_settings

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


class DemoLoginIn(BaseModel):
    usuario: str
    senha: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/demo", response_model=TokenOut)
def login_demo(payload: DemoLoginIn):
    s = get_settings()
    if payload.usuario != s.demo_user or payload.senha != s.demo_pass:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
    return TokenOut(access_token=issue_demo_token(payload.usuario))
