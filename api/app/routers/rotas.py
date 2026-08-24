from __future__ import annotations
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Parada, Rota
from app.schemas import CheckinIn, MapaOut, ParadaCreate, ParadaOut, PendenciaIn, RotaCreate, RotaOut

router = APIRouter(prefix="/api/v1", tags=["rotas"])

@router.get("/rotas", response_model=list[RotaOut])
def list_rotas(db: Session = Depends(get_db)):
    return db.query(Rota).order_by(Rota.id.desc()).all()

@router.post("/rotas", response_model=RotaOut, status_code=201)
def create_rota(body: RotaCreate, db: Session = Depends(get_db)):
    row = Rota(nome=body.nome, data=body.data or date.today())
    db.add(row); db.commit(); db.refresh(row)
    return row

@router.get("/rotas/{rota_id}", response_model=RotaOut)
def get_rota(rota_id: int, db: Session = Depends(get_db)):
    row = db.get(Rota, rota_id)
    if not row: raise HTTPException(404, "Rota não encontrada.")
    return row

@router.post("/rotas/{rota_id}/paradas", response_model=ParadaOut, status_code=201)
def add_parada(rota_id: int, body: ParadaCreate, db: Session = Depends(get_db)):
    if not db.get(Rota, rota_id): raise HTTPException(404, "Rota não encontrada.")
    p = Parada(rota_id=rota_id, endereco=body.endereco)
    db.add(p); db.commit(); db.refresh(p)
    return p

@router.post("/paradas/{parada_id}/checkin", response_model=ParadaOut)
def checkin(parada_id: int, body: CheckinIn, db: Session = Depends(get_db)):
    p = db.get(Parada, parada_id)
    if not p: raise HTTPException(404, "Parada não encontrada.")
    p.lat, p.lng = body.lat, body.lng
    p.checked_at = datetime.utcnow()
    p.status = "feito"
    db.commit(); db.refresh(p)
    return p

@router.post("/paradas/{parada_id}/pendencia", response_model=ParadaOut)
def pendencia(parada_id: int, body: PendenciaIn, db: Session = Depends(get_db)):
    p = db.get(Parada, parada_id)
    if not p: raise HTTPException(404, "Parada não encontrada.")
    p.pendencia = body.texto
    p.status = "problema"
    db.commit(); db.refresh(p)
    return p

@router.get("/rotas/{rota_id}/mapa", response_model=MapaOut)
def mapa(rota_id: int, db: Session = Depends(get_db)):
    row = db.get(Rota, rota_id)
    if not row: raise HTTPException(404, "Rota não encontrada.")
    pontos = [{"parada_id": p.id, "endereco": p.endereco, "lat": p.lat, "lng": p.lng, "status": p.status} for p in row.paradas]
    return MapaOut(rota_id=rota_id, pontos=pontos)
