def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_fluxo_rota(client):
    r = client.post("/api/v1/rotas", json={"nome": "Rota Centro"})
    assert r.status_code == 201
    rota = r.json()
    rid = rota["id"]

    r = client.post(f"/api/v1/rotas/{rid}/paradas", json={"endereco": "Rua A, 100", "ordem": 1})
    assert r.status_code == 201
    pid = r.json()["paradas"][0]["id"]

    r = client.post(f"/api/v1/rotas/paradas/{pid}/checkin", json={"lat": -23.55, "lng": -46.63})
    assert r.status_code == 200
    assert r.json()["status"] == "feito"

    r = client.get(f"/api/v1/rotas/{rid}")
    body = r.json()
    assert body["contagens"]["feitas"] == 1
    assert body["contagens"]["total_paradas"] == 1


def test_rota_hoje(client):
    r = client.post("/api/v1/rotas", json={"nome": "Hoje"})
    assert r.status_code == 201
    r = client.get("/api/v1/rotas/hoje")
    assert r.status_code == 200
    nomes = [x["nome"] for x in r.json()]
    assert "Hoje" in nomes
    for rota in r.json():
        c = rota["contagens"]
        assert set(c.keys()) == {"total_paradas", "feitas", "pendentes", "problemas"}


def test_pendencia_e_listagem(client):
    rid = client.post("/api/v1/rotas", json={"nome": "Pend"}).json()["id"]
    pid = client.post(f"/api/v1/rotas/{rid}/paradas", json={"endereco": "Rua B, 20"}).json()["paradas"][0]["id"]

    # checkin antes da pendência — lat/lng devem ser preservados
    client.post(f"/api/v1/rotas/paradas/{pid}/checkin", json={"lat": 1.0, "lng": 2.0})
    r = client.post(f"/api/v1/rotas/paradas/{pid}/pendencia", json={"texto": "cliente ausente"})
    assert r.status_code == 200
    assert r.json()["status"] == "problema"
    assert r.json()["lat"] == 1.0

    r = client.get(f"/api/v1/rotas/{rid}/pendencias")
    assert r.status_code == 200
    assert len(r.json()) == 1
    assert r.json()[0]["id"] == pid


def test_checkin_com_accuracy(client):
    rid = client.post("/api/v1/rotas", json={"nome": "Acc"}).json()["id"]
    pid = client.post(f"/api/v1/rotas/{rid}/paradas", json={"endereco": "Rua C, 5"}).json()["paradas"][0]["id"]

    r = client.post(
        f"/api/v1/rotas/paradas/{pid}/checkin",
        json={"lat": -23.5, "lng": -46.6, "accuracy_m": 8.5},
    )
    assert r.status_code == 200
    assert r.json()["accuracy_m"] == 8.5

    # re-checkin permitido, atualiza coords
    r = client.post(f"/api/v1/rotas/paradas/{pid}/checkin", json={"lat": -23.51, "lng": -46.61})
    assert r.status_code == 200
    assert r.json()["lat"] == -23.51

    # 404 para parada inexistente
    r = client.post("/api/v1/rotas/paradas/99999/checkin", json={"lat": 0, "lng": 0})
    assert r.status_code == 404

    # mapa inclui accuracy
    r = client.get(f"/api/v1/rotas/{rid}/mapa")
    pontos = r.json()["pontos"]
    assert len(pontos) == 1
    assert pontos[0]["accuracy_m"] == 8.5


def test_payments_manual(client):
    r = client.get("/api/v1/payments/providers")
    assert r.status_code == 200
    names = [p["name"] for p in r.json()]
    assert "manual" in names

    r = client.post(
        "/api/v1/payments/charge",
        json={"provider": "manual", "valor_centavos": 1500, "referencia": "pedido-1"},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["provider"] == "manual"
    assert body["valor_centavos"] == 1500
    assert body["referencia"] == "pedido-1"
    assert body["id"].startswith("man_")

    r = client.post("/api/v1/payments/charge", json={"provider": "asaas", "valor_centavos": 100})
    assert r.status_code == 400
