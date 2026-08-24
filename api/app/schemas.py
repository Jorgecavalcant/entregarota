from __future__ import annotations
from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class RotaCreate(BaseModel):
    nome: str
    data: Optional[date] = None

class ParadaCreate(BaseModel):
    endereco: str = Field(min_length=3)

class CheckinIn(BaseModel):
    lat: float
    lng: float

class PendenciaIn(BaseModel):
    texto: str = Field(min_length=3)

class ParadaOut(BaseModel):
    id: int
    rota_id: int
    endereco: str
    status: str
    lat: Optional[float]
    lng: Optional[float]
    checked_at: Optional[datetime]
    pendencia: Optional[str]
    model_config = {"from_attributes": True}

class RotaOut(BaseModel):
    id: int
    nome: str
    data: date
    paradas: List[ParadaOut] = []
    model_config = {"from_attributes": True}

class MapaOut(BaseModel):
    rota_id: int
    pontos: List[dict]
