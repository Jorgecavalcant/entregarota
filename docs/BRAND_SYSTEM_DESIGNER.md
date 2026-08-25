# Brand System — EntregaRota

| Campo | Valor |
|:---|:---|
| Produto | EntregaRota |
| Versão deste doc | **2.0** vigente |
| Dono | CEO + diretor-design-ux + designer-visual |
| Última atualização | 2026-08-24 |
| Status | [x] vigente para peça pública e produto |

---

## 1. Para que este arquivo existe

Contrato visual e de experiência do **EntregaRota** — landing, rota do entregador (check-in), operador e área gerencial.

Implementação: `web/app/globals.css` (tokens `:root`) + App Router. Este doc manda; o CSS obedece.

---

## 2. Escopo

**Vale para:** `entregarota.tech42.com.br` — `/`, `/rota`, `/operador`, home gerencial, dashboard, settings, users.

**Não vale para:** institucional Tech 42 e demais produtos da casa.

**Público:** entregador (rota do dia + check-in geo); operador (monta rota).

---

## 3. Chassis Tech42 (comum) + pele EntregaRota (distinta)

### 3.1 Chassis — o que não muda entre produtos da casa

| Camada | Regra |
|:---|:---|
| UX | 1 ação óbvia por vista; DNA Cerbasi; mobile-first; alvos ≥ 44px; contraste WCAG AA |
| Escala tipográfica | Display → H1 → H2 → H3 → Body → Small → Caption |
| Estados UI | hover / focus / disabled / error / success / loading |
| Spacing | base **8px**; múltiplos 4/8/12/16/24/32/48 |
| Canto | **10–12px** em controles (não pill 999px como padrão) |
| Card | só quando há interação (parada acionável) |
| Layouts | home gerencial, dashboard, settings, users (§8) |

### 3.2 Pele — o que é só EntregaRota

| Dimensão | Decisão |
|:---|:---|
| Atmosfera | Rua / trajeto: floresta-asfalto à noite + waypoint cítrico |
| Paleta | Verde-rota profundo + cítrico de sinalização |
| Display | **Syne** (geométrica, movimento) |
| UI | **IBM Plex Sans** (legível na rua) |
| Voz | Operacional de rua, claro, sem “logística enterprise” |

**Nota de direção:** produto **escuro frio** (noite de entrega). Distinto do boteco quente (PedidoMesa) e do pátio claro (LavaSeguro).

---

## 4. DNA da casa vs voz deste produto

**Base:** DNA Cerbasi — acolher, educar, um próximo passo, sem pressão.

**Voz EntregaRota:**

- Tom: operacional de rua, claro, sem jargão
- Trata o leitor de: **você**
- Palavras que usamos: rota do dia, check-in, parada, pendência
- Palavras que não usamos: enterprise, otimização avançada (fora do MVP), pressão de payment
- Promessa: **Rota do dia na mão; check-in no local; pendência sem WhatsApp.**

---

## 5. UX — como funciona

### 5.1 Princípios

1. Tela crítica = `/rota` (próxima parada + check-in)
2. Uma ação óbvia por card de parada
3. Pendência em texto humano
4. Operador monta rota; entregador executa
5. Sem payments na jornada do MVP

### 5.2 Próximo passo padrão

Landing → **Minha rota de hoje** → check-in na próxima parada → próxima

### 5.3 Estados obrigatórios (comportamento)

| Estado | O que vê | O que faz |
|:---|:---|:---|
| Carregando | “Carregando rota…” | Esperar |
| Vazio | “Nenhuma rota para hoje” | Operador criar |
| Erro | Causa humana (geo/rede) | Tentar de novo |
| Sucesso | “Check-in ok na parada N” | Próxima parada |

### 5.4 Acessibilidade (piso)

- Cítrico (`--color-accent`) = CTA/waypoint; texto longo em `--color-text` no fundo escuro
- Muted ≥ 4.5:1 no bg
- Alvos ≥ 44px (luva/sol); `prefers-reduced-motion`

### 5.5 Confiança e dado

- Geo só para check-in; sem PII em logs; sem payments no MVP

---

## 6. UI — pele EntregaRota

### 6.1 Logo

| Uso | Arquivo | Fundo |
|:---|:---|:---|
| Marca tipográfica | **EntregaRota** em Syne | escuro floresta |
| Favicon | pendente | — |

### 6.2 Cor — regra 70 / 20 / 10

| Fatia | Papel | Hex | Token |
|:---|:---|:---|:---|
| 70% | Fundo | `#0C1512` | `--color-bg` |
| 20% | Marca / superfície | `#1F4A3A` / soft `#14241C` | `--color-brand` / `--color-surface` |
| 10% | Acento / CTA | `#E6C84A` | `--color-accent` |

| Nome | Hex | Token | Uso |
|:---|:---|:---|:---|
| Texto | `#E8F0EA` | `--color-text` | body |
| Texto auxiliar | `#9BB5A6` | `--color-muted` | auxiliar |
| Linha | `#2A3F34` | `--color-border` | bordas |
| Sucesso | `#5FCF8E` | `--color-success` | check-in ok |
| Erro | `#F07868` | `--color-error` | erro / geo fail |
| Hover accent | `#F0D45C` | `--color-accent-hover` | CTA hover |
| Disabled | `#4A5C52` | `--color-disabled` | inativo |

### 6.3 Tipografia

| Papel | Família | Pesos | Token | Fallback |
|:---|:---|:---|:---|:---|
| Display / títulos | Syne | 600–700 | `--font-display` | system-ui, sans-serif |
| UI / corpo | IBM Plex Sans | 400–600 | `--font-ui` | system-ui, sans-serif |

**Escala (chassis):** Display 40 → H1 32 → H2 24 → H3 20 → Body 16 → Small 14 → Caption 12.

### 6.4 Espaço, canto, elevação

| Token | Valor | Uso |
|:---|:---|:---|
| `--space-unit` | 8px | base |
| `--radius-control` | 12px | botão, input |
| `--radius-surface` | 12px | card de parada |
| `--shadow-soft` | `0 8px 24px rgba(0,0,0,.4)` | elevação; sem glow |
| `--max-width` | 960px | conteúdo |

### 6.5 Estados visuais de controle

| Estado | Botão primário | Input |
|:---|:---|:---|
| Default | bg accent, texto `#0C1512` | bg surface, border |
| Hover | accent-hover | border mais claro |
| Focus | ring 2px accent | ring 2px accent |
| Disabled | disabled + opacity 0.55 | idem |
| Error | — | border error |
| Success | feedback success curto | — |
| Loading | spinner + disabled | — |

### 6.6 Peças de interface

| Peça | Regra |
|:---|:---|
| Botão principal | **Check-in** / **Minha rota**; um por vista; cítrico |
| Botão secundário | Contorno; pendência |
| Card de parada | Interativo: endereço + CTA check-in; progressão visual (linha/trajeto), sem clonar Google Maps |
| Tabela (operador) | paradas ordenáveis; ações no fim |
| Badge | status da parada (pendente/ok) — pequeno, não cluster de pills |

### 6.7 Movimento

Progressão de rota ≤ 200ms; sem glow cítrico. `prefers-reduced-motion` off.

---

## 7. Layouts gerenciais (padrões)

### 7.1 Home gerencial

- Shell: marca + papel (operador/entregador)
- Centro: CTA único conforme papel — **Montar rota** ou **Minha rota de hoje**
- KPI: paradas restantes / rotas ativas

### 7.2 Dashboard

- Operador: lista de rotas do dia → detalhe de paradas
- Entregador: foco absoluto na próxima parada (resto colapsado)

### 7.3 Settings

- Seções: Empresa, Janelas de entrega, Geo/tolerância, Notificações
- Salvar = único primário

### 7.4 Users

- Tabela: nome, papel (operador/entregador), rota atribuída, status
- CTA: **Convidar** / **Atribuir rota**

---

## 8. Tokens CSS concretos (`web/app/globals.css`)

```css
:root {
  /* Pele EntregaRota */
  --color-bg: #0C1512;
  --color-surface: #14241C;
  --color-brand: #1F4A3A;
  --color-accent: #E6C84A;
  --color-accent-hover: #F0D45C;
  --color-text: #E8F0EA;
  --color-muted: #9BB5A6;
  --color-border: #2A3F34;
  --color-success: #5FCF8E;
  --color-error: #F07868;
  --color-disabled: #4A5C52;
  --color-ring: #E6C84A;
  --color-on-accent: #0C1512;

  --font-display: "Syne", system-ui, sans-serif;
  --font-ui: "IBM Plex Sans", system-ui, sans-serif;

  /* Chassis */
  --space-unit: 8px;
  --radius-control: 12px;
  --radius-surface: 12px;
  --shadow-soft: 0 8px 24px rgba(0, 0, 0, 0.4);
  --max-width: 960px;
  --touch-min: 44px;
}
```

---

## 9. Aplicações fora da tela

| Peça | Como vestir |
|:---|:---|
| Post | Floresta + um waypoint cítrico; uma frase de rota |
| WhatsApp | Voz §4; link “Minha rota” |

---

## 10. Pode / não pode

**Pode:** floresta-asfalto + cítrico, Syne, CTA = rota/check-in, linha de trajeto.

**Não pode:** coral no acento, roxo/indigo, Inter/Roboto, glow, payments no hero, clonar UI de mapas genéricos.

---

## 11. Inventário

| Arquivo | Onde |
|:---|:---|
| Este documento | `docs/BRAND_SYSTEM_DESIGNER.md` |
| Tokens CSS | `web/app/globals.css` |
| Layout + fontes | `web/app/layout.tsx` |

---

## 12. Governança

Vigente 2026-08-24 (v2.0). Mudança de cor/tipo: este doc + `:root` juntos.

---

## 13. Checklist

- [x] Doc v2.0 vigente
- [x] Chassis + pele (rua/rota)
- [x] Layouts home/dashboard/settings/users
- [x] Tokens CSS nomeados
- [x] Uma ação óbvia; distinto dos outros 3

---

*Tech 42 LTDA — EntregaRota · Brand System 2.0 · 2026-08-24*
