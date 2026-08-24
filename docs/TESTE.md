# Como testar — EntregaRota (2 min)

**URL:** https://entregarota.tech42.com.br  
**Local:** `make up` → http://localhost:3000 · API http://localhost:8000/docs

## Login

**Sem login** — ferramenta interna de operador (demo aberta).

## Seed

Não há seed automático. Você cria a rota pela tela.

## Fluxo feliz

1. Abra https://entregarota.tech42.com.br/operador → criar rota do dia (paradas).
2. Abra https://entregarota.tech42.com.br/rota → ver rota e fazer **check-in** (geo/ping).
3. Registrar pendência se quiser.
4. Pagamento (se aparecer): **manual/demo**.

## Nota

Se a API falhar no browser após deploy antigo, o front precisa ter sido buildado com `NEXT_PUBLIC_API_URL=https://entregarota.tech42.com.br` (Dockerfile com `ARG`/`ENV`).
