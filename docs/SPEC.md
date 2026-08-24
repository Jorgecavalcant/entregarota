# EntregaRota — SPEC (MVP)

## API (FastAPI, prefixo /api/v1)
- GET /health
- Rotas:
  - GET /rotas — lista todas (com contagens)
  - GET /rotas/hoje — rotas com data=hoje (date.today, timezone-naive)
  - POST /rotas {nome, data?}
  - GET /rotas/{id}
  - POST /rotas/{id}/paradas {endereco, ordem?=0}
  - POST /rotas/paradas/{id}/checkin {lat, lng, accuracy_m?} — re-checkin permitido (atualiza lat/lng); 404 se não existe
  - POST /rotas/paradas/{id}/pendencia {texto min 3} — status=problema; preserva lat/lng de checkins anteriores
  - GET /rotas/{id}/pendencias — paradas com status=problema
  - GET /rotas/{id}/mapa — pontos com lat/lng/status/endereco/accuracy_m
- Pagamentos (plugável, sem Asaas):
  - GET /payments/providers
  - POST /payments/charge {provider, valor_centavos, referencia?} — só `manual` no MVP

## Modelos
- Rota: id, nome, data, criado_em, paradas (ordenadas por ordem,id)
- Parada: id, rota_id, endereco, ordem (default 0), status (pendente|feito|problema), lat, lng, accuracy_m, checked_at, pendencia

## Web (Next.js 14 app router)
- `/` landing com links
- `/rota` — primeira rota de hoje, check-in geolocation, pendências, lista de pontos
- `/operador` — criar rota, adicionar paradas com ordem, resumo de contagens
- NEXT_PUBLIC_API_URL fallback http://localhost:8000

## Restrições
- Sem Asaas. DNS é responsabilidade do operador humano (ver DNS-CADDY.md). Sem secrets reais.
