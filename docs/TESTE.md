# TESTE.md — EntregaRota

Guia de teste manual ponta a ponta.

## Login explícito

O login é sempre manual, na página /entrar:

1. Abra /entrar.
2. Use as credenciais demo:
   - Usuário: demo
   - Senha: demo123
3. Em sucesso, o token fica salvo em localStorage sob a chave er_demo_token
   e você é redirecionado para o parâmetro next ou para /.

Não há auto-login, login silencioso nem retry automático. Falhou? Entre de novo.

## Fluxo principal

### 1. Entrar → Operador

1. Faça login em /entrar com demo / demo123.
2. Vá em /operador.
3. Crie uma rota informando um nome (ex.: "Centro — manhã").
4. Adicione paradas: endereço obrigatório, ordem opcional
   (se vazia, assume a próxima ordem disponível).
5. A lista de paradas aparece com badge de status (pendente).

### 2. Operador → Rota (execução)

1. Clique em "Executar a rota" (ou navegue direto a /rota).
2. Confira os stats Total / Feitas / Pendentes / Problemas e a barra de progresso.
3. Em cada parada pendente:
   - Fazer check-in → pede permissão de GPS → envia lat/lng → status vira "feito",
     contagens e progresso atualizam.
   - Registrar problema → texto com mínimo 3 caracteres → status vira "problema".
4. Coordenadas ficam visíveis em "Ver pontos" (<details>), junto de accuracy e horário.

### 3. Empty state de /rota

Se não houver rota hoje, /rota mostra a mensagem "Nenhuma rota para hoje"
com um link/botão para /operador. Não há redirecionamento automático —
o usuário escolhe ir criar a rota.

## GPS negado

Se a permissão de localização for negada (ou expirar), o botão NÃO marca a parada
e exibe a mensagem humana:

    Precisamos da sua localização só no check-in. Permita o GPS e tente de novo.

Nenhum dado é enviado à API nesse caso.

## Comportamento de auth

- Toda mutação (POST) sem token lança AUTH_REQUIRED antes de bater na rede.
- Qualquer resposta 401 limpa o token e dispara redirect para /entrar?next=<path>.
- GETs (/api/v1/rotas/hoje) são abertos no backend; o Bearer vai junto se existir token.

## Ambientes

### Local

1. Suba tudo com make up.
2. Frontend: http://localhost:3000
3. API + Swagger: http://localhost:8000/docs

### Produção

- App e API no mesmo host: https://entregarota.tech42.com.br
- Swagger: https://entregarota.tech42.com.br/docs

## Checklist curto

- [ ] /entrar loga com demo / demo123 e salva er_demo_token
- [ ] Senha errada mostra alerta de erro sem travar o form
- [ ] /rota sem login → redirect /entrar?next=/rota
- [ ] /rota sem rota hoje mostra mensagem + link para /operador (sem redirect)
- [ ] /operador cria rota e adiciona paradas (lista com badge pendente)
- [ ] Check-in pede GPS, muda status para feito, stats/progresso atualizam
- [ ] GPS negado mostra a mensagem humana e não envia nada
- [ ] Pendência com menos de 3 caracteres fica desabilitada
- [ ] Sair limpa o token e volta para /entrar
- [ ] Em prod, app e docs respondem no mesmo host


## Ambiente nesta entrega (2026-08-25)

- **GitHub `main` (após merge desta PR):** rotas Salto UX + light/dark + gaps desta missão.
- **Produção `*.tech42.com.br`:** ainda pode estar no build antigo enquanto secrets `VPS_HOST`/`VPS_USER`/`VPS_SSH_KEY` não estiverem no GitHub Actions. Sem esses secrets o CD não atualiza a VPS.
- **Como testar agora sem Docker Desktop:** na pasta do produto, API com venv (`make test` valida API) e `cd web && npm run dev` (aponta `NEXT_PUBLIC_API_URL` se a API não estiver em :8000).
