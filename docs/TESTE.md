# Como testar — EntregaRota (2 min)

**URL:** https://entregarota.tech42.com.br  
**Local:** `make up` → http://localhost:3000 · API http://localhost:8000/docs

## Login

**Automático no front** — o app chama `POST /api/v1/auth/demo` com o usuário demo (`demo` / `demo123`) e envia o token Bearer automaticamente nas mutações.

Para testar a API direto:

```bash
curl -s -X POST https://entregarota.tech42.com.br/api/v1/auth/demo \
  -H 'Content-Type: application/json' \
  -d '{"usuario":"demo","senha":"demo123"}'
# use o access_token no header: Authorization: Bearer <token>
```

Mutações (criar rota, parada, check-in, pendência, charge) sem token → **401**.
GETs (hoje, listar, obter, pendências, mapa, providers, health) ficam abertos.

## Seed

Não há seed automático. Você cria a rota pela tela.

## Fluxo feliz

1. Abra https://entregarota.tech42.com.br/operador → criar rota do dia (paradas).
2. Abra https://entregarota.tech42.com.br/rota → ver rota e fazer **check-in** (geo/ping).
3. Registrar pendência se quiser.
4. Pagamento (se aparecer): **manual/demo**.

## Nota

Se a API falhar no browser após deploy antigo, o front precisa ter sido buildado com `NEXT_PUBLIC_API_URL=https://entregarota.tech42.com.br` (Dockerfile com `ARG`/`ENV`).
