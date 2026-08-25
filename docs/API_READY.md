# API_READY.md — EntregaRota

Referência de prontidão da API para o frontend web.

## Descoberta

- **Swagger UI:** /docs (mesmo host da aplicação)
- **OpenAPI JSON:** /openapi.json

A OpenAPI é a fonte única de verdade para contratos de request/response.
Em produção, API e docs são servidos pelo mesmo host:
https://entregarota.tech42.com.br/docs e https://entregarota.tech42.com.br/openapi.json

Ambientes:

| Ambiente | Base URL |
|---|---|
| Local | http://localhost:8000 |
| Prod | https://entregarota.tech42.com.br |

## Tags

- auth — login demo e emissão de token
- rotas — rotas, paradas, check-ins e pendências
- payments — cobranças (fora deste salto)
- health — healthcheck do serviço

## Endpoints usados neste salto

### POST /api/v1/auth/demo (tag: auth)

Body:

    { "usuario": "demo", "senha": "demo123" }

Response 200:

    { "access_token": "<jwt>" }

Credenciais de demonstração: usuario=demo, senha=demo123.

### GET /api/v1/rotas/hoje (tag: rotas)

**Aberto** — não exige Bearer. Se um token existir no client, é anexado,
mas nunca obrigatório.

Response 200: array de Rota (pode ser vazio).

### POST /api/v1/rotas (tag: rotas)

Bearer obrigatório. Body:

    { "nome": "Centro — manhã" }

Response 200: Rota criada (com paradas vazias e contagens zeradas).

### POST /api/v1/rotas/{id}/paradas (tag: rotas)

Bearer obrigatório. Body:

    { "endereco": "Rua X, 123", "ordem": 2 }

Response 200: **Rota completa atualizada** (não apenas a parada).

### POST /api/v1/rotas/paradas/{id}/checkin (tag: rotas)

Bearer obrigatório. Body (accuracy_m opcional):

    { "lat": -23.5505, "lng": -46.6333, "accuracy_m": 12.5 }

Response 200: Parada com status "feito", lat/lng/accuracy_m/checked_at preenchidos.

### POST /api/v1/rotas/paradas/{id}/pendencia (tag: rotas)

Bearer obrigatório. Body (texto com mínimo 3 caracteres):

    { "texto": "Cliente ausente" }

Response 200: Parada com status "problema" e pendencia preenchida.
Texto < 3 caracteres → erro 422/400 pela validação do backend.

## Shapes principais

### Contagens

    {
      "total_paradas": 5,
      "feitas": 2,
      "pendentes": 2,
      "problemas": 1
    }

### Parada

status é sempre lowercase: pendente | feito | problema.

    {
      "id": 1,
      "endereco": "Rua X, 123",
      "ordem": 1,
      "status": "pendente",
      "lat": null,
      "lng": null,
      "accuracy_m": null,
      "checked_at": null,
      "pendencia": null
    }

Após check-in bem-sucedido:

    {
      "id": 1,
      "endereco": "Rua X, 123",
      "ordem": 1,
      "status": "feito",
      "lat": -23.5505,
      "lng": -46.6333,
      "accuracy_m": 12.5,
      "checked_at": "2025-01-15T14:03:00Z",
      "pendencia": null
    }

### Rota

    {
      "id": 1,
      "nome": "Centro — manhã",
      "data": "2025-01-15",
      "paradas": [],
      "contagens": { "total_paradas": 0, "feitas": 0, "pendentes": 0, "problemas": 0 }
    }

paradas vem ordenado por ordem; contagens reflete o estado atual da rota.

## Autenticação

- Todas as mutações (POST) exigem header Authorization: Bearer <access_token>.
- Token obtido via POST /api/v1/auth/demo; armazenado no client sob er_demo_token.
- 401 em qualquer chamada → client limpa o token e lança AUTH_REQUIRED;
  a UI redireciona para /entrar?next=<path>.
- Mutação sem token no client → erro local AUTH_REQUIRED antes de bater na API.
- GETs (/api/v1/rotas/hoje) são abertos.
- **Sem auto-login e sem auto-retry**: falha de autenticação exige novo login manual em /entrar.

## Fora deste salto

- MCP: não implementado nesta entrega.
- Geofence rígido: o check-in registra apenas coordenadas (lat, lng, accuracy_m opcional);
  tolerância/geofence entra depois.
- Frota e payments: presentes na OpenAPI, sem integração no frontend ainda.

## Checklist de prontidão

- [ ] /docs carrega Swagger UI com tags auth/rotas/payments/health
- [ ] /openapi.json reflete os shapes desta página
- [ ] Mutações sem Bearer retornam 401
- [ ] Mutações com Bearer demo retornam 200
- [ ] POST .../pendência rejeita texto menor que 3 caracteres
- [ ] addParada retorna Rota completa (frontend usa essa resposta para atualizar estado)
- [ ] Client web consome todos os endpoints listados sem divergência de contrato
