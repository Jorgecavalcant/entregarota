from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    assert client.get("/health").json()["status"] == "ok"


def test_fluxo_rota():
    r = client.post("/api/v1/rotas", json={"nome": "Rota Centro"}).json()
    p = client.post(f"/api/v1/rotas/{r['id']}/paradas", json={"endereco": "Rua A, 10"}).json()
    ck = client.post(f"/api/v1/paradas/{p['id']}/checkin", json={"lat": -23.5, "lng": -46.6})
    assert ck.status_code == 200
    assert ck.json()["status"] == "feito"
    m = client.get(f"/api/v1/rotas/{r['id']}/mapa").json()
    assert len(m["pontos"]) == 1
