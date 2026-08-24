# Brand System — EntregaRota

| Campo | Valor |
|:---|:---|
| Produto | EntregaRota |
| Versão deste doc | 1.0 vigente |
| Dono | CEO + designer-visual |
| Última atualização | 2026-08-24 |
| Status | [x] vigente para peça pública |

---

## 1. Para que este arquivo existe

Contrato visual e de experiência do **EntregaRota** — landing, rota do entregador (check-in) e operador.

Implementação: `web/app/globals.css` + App Router.

---

## 2. Escopo

**Vale para:** `entregarota.tech42.com.br`, `/`, `/rota`, `/operador`.

**Não vale para:** institucional Tech 42 e demais produtos da casa.

**Público:** entregador (rota do dia + check-in geo); operador (monta rota).

---

## 3. DNA da casa vs voz deste produto

**Base:** DNA Cerbasi — acolher, educar, um próximo passo, sem pressão.

**Voz deste produto:**

- Tom: operacional de rua, claro, sem “logística enterprise”
- Trata o leitor de: **você**
- Palavras que usamos: rota do dia, check-in, parada, pendência
- Palavras que não usamos: enterprise, otimização avançada (fora do MVP), pressão de payment
- Promessa: **Rota do dia na mão; check-in no local; pendência sem WhatsApp.**

---

## 4. UX — como funciona

### 4.1 Princípios

1. Tela crítica = `/rota` (próxima parada + check-in)
2. Uma ação óbvia por card de parada
3. Pendência em texto humano
4. Operador monta rota; entregador executa
5. Sem payments na jornada do MVP

### 4.2 Próximo passo

Landing → **Minha rota de hoje** (primário) → check-in na próxima parada

### 4.3 Estados

| Estado | O que vê | O que faz |
|:---|:---|:---|
| Carregando | “Carregando rota…” | Esperar |
| Vazio | “Nenhuma rota para hoje” | Operador criar |
| Erro | Causa humana (geo/API) | Tentar de novo |
| Sucesso | “Check-in ok na parada N” | Próxima parada |

### 4.4 Acessibilidade

- Acento **cítrico** `#E8C547` (coral fora — contraste)
- Body `#EAF3EC`; muted `#A8C4B0`
- Alvos ≥ 44px; `prefers-reduced-motion`

---

## 5. UI

### 5.2 Cor — 70 / 20 / 10

| Fatia | Hex | Papel |
|:---|:---|:---|
| 70% | `#0F1F17` | Fundo floresta |
| 20% | `#2D5A3D` / soft `#1A2E24` | Marca / cards |
| 10% | `#E8C547` | CTA / waypoint |

| Extra | Hex |
|:---|:---|
| Texto | `#EAF3EC` |
| Muted | `#A8C4B0` |
| Linha | `#2A4034` |
| Ok | `#6FCF97` |
| Erro | `#FF7A6E` |

### 5.3 Tipografia

| Papel | Família |
|:---|:---|
| Título | Syne |
| UI | IBM Plex Sans |

### 5.4–5.6

Base 8px; canto 12px; atmosfera de trajeto (linha/progressão), sem clonar Google Maps.

---

## 7. Pode / não pode

**Pode:** floresta + cítrico, Syne, CTA primário = rota.

**Não pode:** coral no acento, roxo/indigo, Inter/Roboto, payments no hero.

---

## 8. Inventário

| Arquivo | Onde |
|:---|:---|
| Este doc | `docs/BRAND_SYSTEM_DESIGNER.md` |
| Tokens | `web/app/globals.css` |

---

*Tech 42 LTDA — EntregaRota.*
