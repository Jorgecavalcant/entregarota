# PRD — EntregaRota

> **Produto:** EntregaRota  
> **Domínio:** https://entregarota.tech42.com.br  
> **Path:** `PROJETOS/entregarota`  
> **Prioridade conselho:** 4  
> **Versão:** Salto UX 2026-08  
> **Status:** [x] Em revisão (CPO) — aguarda aprovação CEO  
> **Telas:** `/`, `/rota`, `/operador`

---

## Em uma frase

App de distribuição local: **rota do dia**, **check-in** usável e painel de entregas feitas/pendentes — com login explícito.

---

## Problema (por que o salto agora)

O MVP já tem rota de hoje, check-in com GPS e contagens, mas:

1. Auth é **auto-login invisível** (`ensureAuth` / demo) — demo não parece produto real
2. Painel de feitas/pendentes existe como números, mas o salto pede clareza operacional
3. Mapa/lista ainda ruidosos para o entregador (SHOULD)

**Se não resolver (e houver tempo no pacote prio 4):** EntregaRota fica atrás dos produtos prio 1–3 no conselho.

---

## Objetivos e métricas

| Objetivo | Métrica de sucesso |
|---|---|
| Rota do dia usável | Entregador abre `/rota` e vê a rota de hoje sem erro de empty state confuso |
| Check-in usável | Um toque → GPS → status feito; mensagem clara se GPS negado |
| Painel feitas/pendentes | Operador e entregador veem totais feitos vs pendentes (e problemas) |
| Auth explícito | Tela de entrar; sem auto-login silencioso |

---

## Escopo Salto UX 2026-08

### MUST (se tempo — conselho prio 4)

- [ ] Rota do dia + check-in **usável** (fluxo feliz + erro de GPS legível)
- [ ] Painel de entregas **feitas / pendentes** (e problemas, se já existir)
- [ ] Auth **explícito** (login visível; não só auto-login invisível)

### SHOULD

- [ ] Mapa ou lista limpa (menos ruído; coordenadas só onde ajudam)

### WON'T (não inflar)

- Otimização avançada de rota (TSP, reordenação inteligente)
- Frota multi-veículo / multi-entregador avançado
- Geo-fence complexo (raio obrigatório, alerta de fora da área)
- Asaas / gateway no core deste salto
- App nativo

---

## User Stories

**Papéis:** Operador · Entregador

1. Como entregador, quero ver a rota de hoje e fazer check-in na parada, para marcar entrega feita no lugar certo.
2. Como entregador, quero registrar pendência em texto curto, para avisar problema sem ligar.
3. Como operador, quero montar a rota do dia e ver feitas/pendentes, para acompanhar o turno.
4. Como operador/entregador, quero entrar com usuário e senha, para a demo mostrar controle de acesso.

---

## Regras de negócio

1. “Rota de hoje” = rotas com `data` = dia corrente (timezone documentada na SPEC).
2. Check-in grava lat/lng/accuracy e marca parada como feita (re-checkin atualiza coordenadas).
3. Pendência: texto ≥ 3 caracteres → status `problema`.
4. Mutações (criar rota, parada, check-in, pendência) exigem Bearer após login explícito.
5. Sem frota multi e sem geofence: check-in não bloqueia por distância.

**Compliance**

- [x] LGPD: geolocalização só no momento do check-in; não guardar trajetória contínua
- [x] CVM 175: N/A
- [x] Segredos só em `.env`

---

## Contexto técnico (basico — detalhe na SPEC)

- Stack: FastAPI + Next.js 14
- Já existe: `/api/v1/rotas/*`, check-in, pendências, contagens, auth demo
- Gap deste salto: UI de login explícito; polimento rota/check-in; clareza do painel feitas/pendentes; limpeza mapa/lista (SHOULD)

---

## Prioridade

- **Urgência:** Média-alta (conselho prio 4 — “se tempo”)
- **Depende de:** MVP no ar (`entregarota.tech42.com.br`)
- **Bloqueia:** demo salto UX EntregaRota

---

## Histórico

| Versão | Data | O que mudou |
|---|---|---|
| MVP | 2026-08 | Rota do dia, check-in geo, pendências, operador |
| Salto UX 2026-08 | 2026-08-24 | MUST: rota+check-in usável, painel feitas/pendentes, auth explícito |
