# SPEC — EntregaRota MVP

## API
- `GET /health`
- `GET/POST /api/v1/rotas` — rotas do dia
- `POST /api/v1/rotas/{id}/paradas` — adiciona parada
- `POST /api/v1/paradas/{id}/checkin` — lat/lng + timestamp
- `POST /api/v1/paradas/{id}/pendencia` — texto da pendência
- `GET /api/v1/rotas/{id}/mapa` — pontos para ping no mapa

## Web
- `/` landing
- `/rota` rota do dia + check-in
- `/operador` montar rota
