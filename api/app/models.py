from datetime import datetime, date
from typing import Optional

from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Rota(Base):
    __tablename__ = "rotas"

    id = Column(Integer, primary_key=True)
    nome = Column(String(120), nullable=False)
    data = Column(Date, nullable=False, default=date.today)
    criado_em = Column(DateTime, nullable=False, default=datetime.utcnow)

    paradas = relationship(
        "Parada", back_populates="rota", cascade="all, delete-orphan",
        order_by="Parada.ordem, Parada.id",
    )


class Parada(Base):
    __tablename__ = "paradas"

    id = Column(Integer, primary_key=True)
    rota_id = Column(Integer, ForeignKey("rotas.id"), nullable=False)
    endereco = Column(String(255), nullable=False)
    ordem = Column(Integer, nullable=False, default=0)
    status = Column(String(20), nullable=False, default="pendente")  # pendente|feito|problema
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    accuracy_m = Column(Float, nullable=True)
    checked_at = Column(DateTime, nullable=True)
    pendencia = Column(String(500), nullable=True)

    rota = relationship("Rota", back_populates="paradas")
