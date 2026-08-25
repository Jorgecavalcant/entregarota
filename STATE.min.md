# STATE.min — EntregaRota

- **Status:** Salto UX 2026-08 (auth explícito + rota/check-in usável + brand v2)
- **Domínio:** entregarota.tech42.com.br (DNS = CEO)
- **VPS:** /srv/projetos/clientes/entregarota
- **Deploy:** `.github/workflows/deploy.yml` — push/merge main → CI gate → SSH VPS (`git reset --hard origin/main` + `docker compose up -d --build`, preserva .env) → healthcheck `/`+`/entrar`. Requer secrets `VPS_SSH_KEY`/`VPS_HOST`/`VPS_USER` + clone git na VPS.
- **MVP:** rota do dia, check-in geo, pendências, pagamentos plugáveis (manual)
- **Auth:** UI `/entrar` → POST /api/v1/auth/demo (demo/demo123); sem auto-login silencioso
- **Atualizado:** 2026-08-24
