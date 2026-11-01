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
│   │   ├── App.tsx           # página da loja (cabeçalho, destaque, filtros, grade)
│   │   ├── components/       # GameCard, CartDrawer
│   │   ├── data/jogos.ts     # catálogo de exemplo
│   │   └── utils/format.ts   # formatação de preço, desconto, gradientes
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

A loja segue o protótipo de design (`preview.html`):

- Cabeçalho com busca, contador de favoritos e botão do carrinho
- Banner com o jogo em destaque da semana
- Filtros por plataforma e gênero, opção "só ofertas" e ordenação (preço, avaliação, desconto)
- Grade de jogos com tags de lançamento e de desconto, favoritos e parcelamento
- Carrinho lateral com controle de quantidade, economia, subtotal e finalização do pedido

## Observações

- **O catálogo ainda é estático**: os jogos vêm de `frontend/src/data/jogos.ts`. O próximo passo é criar uma entidade de jogos no backend e uma rota `GET /api/jogos`.
- **O `synchronize` do TypeORM fica ligado fora de produção**: ele cria e altera as tabelas automaticamente. Em produção, use migrations.
- **A recarga automática no Docker usa polling** (`CHOKIDAR_USEPOLLING` no Vite e `TSC_WATCHFILE` no NestJS), porque os eventos de arquivo do Windows não chegam aos containers.
