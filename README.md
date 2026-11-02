# infinity-games-store

Loja de jogos digitais com frontend em React, backend em NestJS e banco PostgreSQL, tudo rodando com Docker.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Backend | NestJS 12 (ESM) + TypeORM |
| Banco de dados | PostgreSQL 17 |
| Infra | Docker Compose |

## Estrutura

```
.
├── backend/             # API NestJS
│   ├── src/
│   │   ├── main.ts           # prefixo global /api e CORS
│   │   ├── app.module.ts     # configuração do TypeORM (PostgreSQL)
│   │   └── app.controller.ts # rotas / e /health
│   └── Dockerfile
├── frontend/            # Loja em React + Vite
│   ├── src/
│   │   ├── App.tsx           # vitrines da loja e rotas por hash (#entrar, #registrar, #checkout)
│   │   ├── components/       # Navbar, Hero, GameCard, GamerHub, Entrar, Registrar, Checkout...
│   │   ├── store/            # estado global (carrinho, desejos, XP, conquistas)
│   │   ├── data/             # catálogo (jogos.ts) e perfil gamer de exemplo (perfil.ts)
│   │   ├── hooks/            # hooks utilitários (clique fora, hash da URL)
│   │   └── utils/            # formatação, resumo do carrinho e validações
│   ├── vite.config.ts        # proxy de /api para o backend
│   └── Dockerfile
├── docker-compose.yml   # serviços db, backend e frontend
└── .env.example         # variáveis de ambiente
```

## Como rodar

### Com Docker (recomendado)

Requisito: [Docker Desktop](https://www.docker.com/products/docker-desktop/) aberto.

```bash
cp .env.example .env
docker compose up --build
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000/api |
| PostgreSQL | `localhost:5432` |

O código de `backend/` e `frontend/` é montado nos containers, então as alterações recarregam automaticamente. Os dados do banco ficam no volume `pgdata`.

Para parar: `docker compose down`. Para parar e **apagar os dados do banco**: `docker compose down -v`.

### Sem Docker (apenas o banco no Docker)

Requisito: Node.js 24.15 ou superior.

```bash
docker compose up -d db

cd backend && npm install && npm run start:dev    # http://localhost:3000/api
cd frontend && npm install && npm run dev         # http://localhost:5173
```

O backend lê o `.env` da raiz e se conecta em `localhost:5432`.

## Como as camadas se conectam

```
Navegador → Vite (:5173) → /api/* → NestJS (:3000) → TypeORM → PostgreSQL (:5432)
```

- O frontend faz as chamadas em `/api/...`, e o Vite repassa essas requisições para o backend. No Docker, o destino é `http://backend:3000` (variável `API_URL`); fora dele, é `http://localhost:3000`.
- O backend usa o `TypeOrmModule` com as credenciais do `.env`. O `autoLoadEntities` registra automaticamente as entidades dos módulos.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `POSTGRES_USER` | `postgres` | Usuário do banco |
| `POSTGRES_PASSWORD` | `postgres` | Senha do banco |
| `POSTGRES_DB` | `infinity_games` | Nome do banco |
| `DB_HOST` | `localhost` | Host do banco (no Docker, é sobrescrito para `db`) |
| `DB_PORT` | `5432` | Porta do banco |

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api` | Retorna `Hello World!` |
| GET | `/api/health` | Verifica a conexão com o banco e retorna a versão do PostgreSQL |

## Frontend

### Identidade visual

- **Cores**: roxo neon `#7C3AED` (principal), azul elétrico `#3B82F6` (secundária) e ciano `#06B6D4` (destaque). Os tokens ficam em `src/index.css`.
- **Tipografia**: Chakra Petch (títulos) e Inter (texto).
- **Fundo**: brilhos em gradiente, grid futurista animado e partículas conectadas em canvas (`Background.tsx`).
- **Mascote**: **Ignis**, o dragão oficial, desenhado em SVG (`Dragon.tsx`). Aparece no selo "Recomendado pelo Dragão", nas recomendações, nas conquistas, nos estados vazios e no rodapé.
- **Capas**: cada jogo tem uma arte SVG gerada a partir de uma cena (cidade, montanhas, espaço, floresta, oceano, arena ou deserto) e da sua paleta (`GameCover.tsx`). Troque por imagens reais quando houver.

### Seções da página

| Seção | Destaques |
|---|---|
| Navbar | Busca avançada (Ctrl+K) com filtros de plataforma, gênero e preço, lista de desejos, carrinho e o botão "Olá, Visitante", que abre ao passar o mouse um menu com Entrar e Registrar |
| Hero | Carrossel de destaques com parallax, iluminação animada, nota, plataformas, preço, "Comprar" e "Ver trailer" |
| 🔥 Em Alta | Trilho horizontal ordenado por tendência |
| ⚡ Promoções Relâmpago | Contagem regressiva (ciclos de 6h) e barra de chaves vendidas |
| 🎯 Recomendados para Você | Curadoria do Ignis, com o motivo de cada recomendação |
| 🏆 Mais Vendidos | Pódio com o nº 1 em destaque e ranking do 2º ao 5º |
| Central do Jogador | Nível, XP, conquistas por raridade, ranking da comunidade e lista de desejos |
| 🆕 Lançamentos | Trilho ordenado por data de lançamento |
| 💎 Jogos Indie | Grade em mosaico |
| Catálogo | Filtros por plataforma, gênero e modo, "só ofertas" e ordenação |

### Telas

O projeto não usa biblioteca de rotas: o `App.tsx` escolhe a tela pelo hash da URL (`useHash`). Qualquer outro hash, como `#topo` ou `#promocoes`, mostra a loja. O estado global fica acima das telas, então o carrinho continua igual ao trocar de tela.

| Hash | Tela | Destaques |
|---|---|---|
| `#entrar` | Login | E-mail, senha com botão de mostrar/ocultar e "Lembrar de mim" |
| `#registrar` | Cadastro | Gamertag, e-mail, senha com confirmação e aceite dos termos |
| `#checkout` | Pagamento | Aberta pelo botão "Finalizar compra" do carrinho. Oferece cartão de crédito (prévia do cartão, bandeira e até 6x sem juros), Pix (QR Code, copia e cola e prazo de 10 minutos) e boleto (CPF e linha digitável), além do resumo do pedido com o XP da compra |

As três telas validam cada campo e mostram o erro logo abaixo dele. Os campos de formulário são compartilhados (`Form.tsx`).

### Sistema gamer

Os dados ficam no estado global (`src/store/`). Comprar um jogo rende XP (2 XP por real). Algumas ações desbloqueiam conquistas: comprar em promoção, comprar um indie, comprar um jogo recomendado pelo Ignis ou ter 5 jogos na lista de desejos. Subir de nível e desbloquear conquistas mostra notificações com o mascote, e a posição no ranking se atualiza.

O perfil, o ranking e as notificações são dados de demonstração (`src/data/perfil.ts`). Não há persistência: recarregar a página volta ao estado inicial.

## Observações

- **Login, cadastro e pagamento são de demonstração**: nada é enviado ao backend. Entrar e registrar só mostram uma mensagem de sucesso, e a loja continua como visitante. No pagamento, o QR Code do Pix e a linha do boleto são ilustrativos (não funcionam em apps de banco), o CPF é conferido só pela quantidade de dígitos e, no boleto, os jogos entram na biblioteca na hora. Os próximos passos são as rotas `/api/auth/login` e `/api/auth/registrar` e a integração com um serviço de pagamento.
- **O catálogo e o perfil gamer ainda são estáticos**: vêm de `frontend/src/data/`. O próximo passo é criar entidades no backend (jogos, usuários, conquistas) e as rotas correspondentes.
- **O `synchronize` do TypeORM fica ligado fora de produção**: ele cria e altera as tabelas automaticamente. Em produção, use migrations.
- **A recarga automática no Docker usa polling** (`CHOKIDAR_USEPOLLING` no Vite e `TSC_WATCHFILE` no NestJS), porque os eventos de arquivo do Windows não chegam aos containers.
