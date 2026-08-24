from __future__ import annotations

import os

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["DEMO_USER"] = "demo"
os.environ["DEMO_PASS"] = "demo123"
os.environ["DEMO_TOKEN_SECRET"] = "test-secret"

from app.config import get_settings

get_settings.cache_clear()

import app.database as dbmod

dbmod.engine = dbmod._make_engine()
from sqlalchemy.orm import sessionmaker

dbmod.SessionLocal = sessionmaker(bind=dbmod.engine, autoflush=False, autocommit=False)

from app.database import Base, init_db

init_db()

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture()
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture()
def auth_headers(client):
    r = client.post("/api/v1/auth/demo", json={"usuario": "demo", "senha": "demo123"})
    assert r.status_code == 200
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
