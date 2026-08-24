from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Rota, Parada
from app.schemas import (
    RotaIn, RotaOut, ParadaIn, ParadaOut, CheckinIn, PendenciaIn,
    Contagens, MapaOut, PontoMapa,
)

router = APIRouter(prefix="/api/v1/rotas", tags=["rotas"])


def _contagens(paradas: List[Parada]) -> Contagens:
    feitas = sum(1 for p in paradas if p.status == "feito")
    problemas = sum(1 for p in paradas if p.status == "problema")
    return Contagens(
        total_paradas=len(paradas),
        feitas=feitas,
        pendentes=sum(1 for p in paradas if p.status == "pendente"),
        problemas=problemas,
    )


def _rota_out(rota: Rota) -> RotaOut:
    ordenadas = sorted(rota.paradas, key=lambda p: (p.ordem, p.id))
    return RotaOut(
        id=rota.id,
        nome=rota.nome,
        data=rota.data,
        criado_em=rota.criado_em,
        paradas=[ParadaOut.model_validate(p) for p in ordenadas],
        contagens=_contagens(ordenadas),
    )


@router.get("/hoje", response_model=List[RotaOut])
def rotas_hoje(db: Session = Depends(get_db)):
    rotas = db.query(Rota).filter(Rota.data == date.today()).order_by(Rota.id).all()
    return [_rota_out(r) for r in rotas]


@router.get("", response_model=List[RotaOut])
def listar_rotas(db: Session = Depends(get_db)):
    rotas = db.query(Rota).order_by(Rota.id).all()
    return [_rota_out(r) for r in rotas]


@router.post("", response_model=RotaOut, status_code=201)
def criar_rota(payload: RotaIn, db: Session = Depends(get_db)):
    rota = Rota(nome=payload.nome, data=payload.data or date.today())
    db.add(rota)
    db.commit()
    db.refresh(rota)
    return _rota_out(rota)


@router.get("/{rota_id}", response_model=RotaOut)
def obter_rota(rota_id: int, db: Session = Depends(get_db)):
    rota = db.get(Rota, rota_id)
    if not rota:
        raise HTTPException(status_code=404, detail="Rota não encontrada")
    return _rota_out(rota)


@router.post("/{rota_id}/paradas", response_model=RotaOut, status_code=201)
def add_parada(rota_id: int, payload: ParadaIn, db: Session = Depends(get_db)):
    rota = db.get(Rota, rota_id)
    if not rota:
        raise HTTPException(status_code=404, detail="Rota não encontrada")
    parada = Parada(rota_id=rota_id, endereco=payload.endereco, ordem=payload.ordem)
    db.add(parada)
    db.commit()
    db.refresh(rota)
    return _rota_out(rota)


@router.post("/paradas/{parada_id}/checkin", response_model=ParadaOut)
def checkin(parada_id: int, payload: CheckinIn, db: Session = Depends(get_db)):
    parada = db.get(Parada, parada_id)
    if not parada:
        raise HTTPException(status_code=404, detail="Parada não encontrada")
    from datetime import datetime
    parada.lat = payload.lat
    parada.lng = payload.lng
    if payload.accuracy_m is not None:
        parada.accuracy_m = payload.accuracy_m
    parada.status = "feito"
    parada.checked_at = datetime.utcnow()
    db.commit()
    db.refresh(parada)
    return parada


@router.post("/paradas/{parada_id}/pendencia", response_model=ParadaOut)
def registrar_pendencia(parada_id: int, payload: PendenciaIn, db: Session = Depends(get_db)):
    parada = db.get(Parada, parada_id)
    if not parada:
        raise HTTPException(status_code=404, detail="Parada não encontrada")
    # mantém lat/lng se já havia checkin; grava texto e marca problema
    parada.pendencia = payload.texto
    parada.status = "problema"
    db.commit()
    db.refresh(parada)
    return parada


@router.get("/{rota_id}/pendencias", response_model=List[ParadaOut])
def listar_pendencias(rota_id: int, db: Session = Depends(get_db)):
    rota = db.get(Rota, rota_id)
    if not rota:
        raise HTTPException(status_code=404, detail="Rota não encontrada")
    paradas = (
        db.query(Parada)
        .filter(Parada.rota_id == rota_id, Parada.status == "problema")
        .order_by(Parada.ordem, Parada.id)
        .all()
    )
    return paradas


@router.get("/{rota_id}/mapa", response_model=MapaOut)
def mapa_rota(rota_id: int, db: Session = Depends(get_db)):
    rota = db.get(Rota, rota_id)
    if not rota:
        raise HTTPException(status_code=404, detail="Rota não encontrada")
    pontos = [
        PontoMapa(
            parada_id=p.id,
            lat=p.lat,
            lng=p.lng,
            status=p.status,
            endereco=p.endereco,
            accuracy_m=p.accuracy_m,
        )
        for p in sorted(rota.paradas, key=lambda x: (x.ordem, x.id))
        if p.lat is not None and p.lng is not None
    ]
    return MapaOut(rota_id=rota_id, pontos=pontos)
