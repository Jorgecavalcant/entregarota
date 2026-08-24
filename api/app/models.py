from __future__ import annotations
from datetime import date, datetime
from typing import List, Optional
from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class Rota(Base):
    __tablename__ = "rotas"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nome: Mapped[str] = mapped_column(String(120))
    data: Mapped[date] = mapped_column(Date, default=date.today)
    paradas: Mapped[List["Parada"]] = relationship(back_populates="rota")

class Parada(Base):
    __tablename__ = "paradas"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    rota_id: Mapped[int] = mapped_column(ForeignKey("rotas.id"))
    endereco: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(40), default="pendente")  # pendente|feito|problema
    lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    lng: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    checked_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    pendencia: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    rota: Mapped[Rota] = relationship(back_populates="paradas")
