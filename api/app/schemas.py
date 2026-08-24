from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class RotaIn(BaseModel):
    nome: str = Field(min_length=1, max_length=120)
    data: Optional[date] = None


class ParadaIn(BaseModel):
    endereco: str = Field(min_length=3, max_length=255)
    ordem: int = 0


class CheckinIn(BaseModel):
    lat: float
    lng: float
    accuracy_m: Optional[float] = Field(default=None, ge=0)


class PendenciaIn(BaseModel):
    texto: str = Field(min_length=3, max_length=500)


class ParadaOut(BaseModel):
    id: int
    rota_id: Optional[int] = None
    endereco: str
    ordem: int
    status: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    accuracy_m: Optional[float] = None
    checked_at: Optional[datetime] = None
    pendencia: Optional[str] = None

    class Config:
        from_attributes = True


class Contagens(BaseModel):
    total_paradas: int = 0
    feitas: int = 0
    pendentes: int = 0
    problemas: int = 0


class RotaOut(BaseModel):
    id: int
    nome: str
    data: date
    criado_em: datetime
    paradas: List[ParadaOut] = []
    contagens: Contagens = Contagens()

    class Config:
        from_attributes = True


class PontoMapa(BaseModel):
    parada_id: int
    lat: float
    lng: float
    status: str
    endereco: str
    accuracy_m: Optional[float] = None


class MapaOut(BaseModel):
    rota_id: int
    pontos: List[PontoMapa]


class PaymentProviderOut(BaseModel):
    name: str


class ChargeIn(BaseModel):
    provider: str = "manual"
    valor_centavos: int = Field(gt=0)
    referencia: Optional[str] = None


class ChargeOut(BaseModel):
    id: str
    provider: str
    status: str
    valor_centavos: int
    referencia: Optional[str] = None
