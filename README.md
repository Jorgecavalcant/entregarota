# EntregaRota

Rotas do dia para distribuição local: check-in com geolocalização/ping no mapa e pendências.

**Repositório:** [github.com/Jorgecavalcant/entregarota](https://github.com/Jorgecavalcant/entregarota) (privado)  
**VPS (padrão Tech42):** `/srv/projetos/clientes/entregarota`  
**Domínio:** `entregarota.tech42.com.br` (DNS criado pelo CEO — ver docs/DNS-CADDY.md)

## Stack

| Parte | Tecnologia |
|---|---|
| Web | Next.js 14 |
| API | FastAPI |
| Banco | PostgreSQL 16 |
| Local | Docker Compose |
| Proxy | Caddy |

## Como rodar

```bash
cd PROJETOS/entregarota
cp .env.example .env
make up
make test
```

- Web: http://localhost:3000  
- API: http://localhost:8000/docs  

## Docs

| Arquivo | Para quê |
|---|---|
| [docs/PRD.md](docs/PRD.md) | Negócio |
| [docs/SPEC.md](docs/SPEC.md) | Telas/endpoints MVP |
| [docs/DNS-CADDY.md](docs/DNS-CADDY.md) | DNS (CEO) + Caddy |
| [STATE.md](STATE.md) | Estado atual |
