# SPEC — EntregaRota · Salto UX 2026-08

> Complementa o MVP. Só o delta necessário para o MUST do conselho (prio 4, se tempo). Sem código nesta entrega.

**Produto:** EntregaRota · https://entregarota.tech42.com.br  
**Telas:** `/`, `/rota`, `/operador` (+ eventual `/entrar` ou gate de login)

---

## Baseline (já existe — não reescrever)

### API (prefixo `/api/v1`)
- `GET /health`
- `POST /auth/demo` — usuario/senha → `access_token`
- Rotas: `GET /rotas`, `GET /rotas/hoje`, `POST /rotas`, `GET /rotas/{id}`
- Paradas: `POST /rotas/{id}/paradas`, `POST /rotas/paradas/{id}/checkin`, `POST /rotas/paradas/{id}/pendencia`
- `GET /rotas/{id}/pendencias` · `GET /rotas/{id}/mapa`
- Payments ManualProvider (fora do foco deste salto)

### Modelos
- Rota: id, nome, data, paradas, contagens
- Parada: status `pendente|feita|problema`, lat/lng, accuracy_m, checked_at, pendencia

### Web
- `/` landing · `/rota` check-in · `/operador` monta rota
- Front hoje: `ensureAuth()` / auto-login demo invisível

---

## Delta Salto UX 2026-08

### 1. Rota do dia + check-in usável (MUST)

| Item | Spec |
|---|---|
| Empty state | Sem rota hoje → mensagem + link claro para `/operador` |
| Check-in | Botão por parada; loading enquanto pede GPS; sucesso atualiza badge/contagens |
| GPS negado | Mensagem humana (já esboçada) — manter e garantir que não quebra a página |
| Lista | Ordem por `ordem`; status visível; ações Check-in / Pendência |

Não exigir geofence nem precisão mínima obrigatória.

### 2. Painel feitas / pendentes (MUST)

| Onde | O que mostrar |
|---|---|
| `/rota` | Stats: total · feitas · pendentes · problemas (já existe — garantir labels claros “Feitas / Pendentes”) |
| `/operador` | Mesmos totais da rota ativa do dia + lista de paradas com status |
| Critério | Em 3 segundos o operador entende quanto falta |

Sem dashboard novo: reutilizar contagens da API.

### 3. Auth explícito (MUST)

| Item | Spec |
|---|---|
| UI | Tela `/entrar` **ou** formulário no topo de `/operador` e `/rota` antes de mutações |
| Fluxo | Usuário digita credenciais → `POST /api/v1/auth/demo` → salva token → navega |
| Sair | Botão limpa `localStorage` / token |
| Proibido | Auto-login silencioso no mount (`ensureAuth` sem UI) como único caminho |
| GETs | Podem permanecer abertos como hoje; mutações 401 → redirecionar ao login |

### 4. Mapa / lista limpa (SHOULD)

| Preferência | Detalhe |
|---|---|
| Lista primeiro | Timeline de paradas é a UI principal |
| Coordenadas | Esconder lista crua de lat/lng atrás de “Ver pontos” **ou** link “Abrir no mapa” por ponto |
| Mapa | Só se já houver componente leve; **não** puxar SDK pesado neste salto |

---

## Fora deste salto (WON'T)

- Otimização avançada de rota  
- Frota multi-veículo / multi-entregador avançado  
- Geo-fence complexo  
- Asaas / MCP / app nativo  

---

## Checklist DoD — MUST

- [ ] Entregador conclui check-in feliz em `/rota` com feedback visível
- [ ] Contagens feitas/pendentes legíveis em `/rota` e `/operador`
- [ ] Login explícito na UI; auto-login invisível removido do fluxo principal
- [ ] Empty state sem rota de hoje não confunde
- [ ] Nenhum geofence / otimização / frota multi neste PR

---

## Checklist SHOULD (se couber no mesmo PR)

- [ ] Lista limpa; coordenadas não poluem o fluxo principal

---

## DNS / Deploy

Ver `docs/DNS-CADDY.md` e `docs/DEPLOY-VPS.md`. DNS = CEO. Sem secrets no repo.
