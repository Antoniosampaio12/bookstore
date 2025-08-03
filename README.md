# Bookstore Full-Stack Application

Este é um projeto full-stack de catálogo de livros, construído com AdonisJS no backend e Angular no frontend. A aplicação utiliza PostgreSQL para o banco de dados e Redis para cache, com suporte total a contêineres Docker para facilitar o ambiente de desenvolvimento.

## Índice

- [Tecnologias](#tecnologias)
- [Executando com Docker](#executando-com-docker)
- [Executando Localmente (sem Docker)](#executando-localmente-sem-docker)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Estrutura do Projeto](#estrutura-do-projeto)

## Tecnologias

### Backend:
- AdonisJS (Node.js 22+)
- PostgreSQL
- Redis
- Autenticação JWT (JSON Web Tokens)
- Cache (L2 com Redis e suporte a L1 com cache em memória)

### Frontend:
- Angular 19
- Angular Material
- ng2-charts (Chart.js)

### Ferramentas Adicionais:
- Docker + Docker Compose

## Executando com Docker

O projeto é configurado para rodar facilmente em contêineres Docker, garantindo um ambiente consistente para desenvolvimento e produção.

### Construindo os contêineres pela primeira vez (com build e sem cache)
```bash
docker compose build --no-cache
```

### Subindo os contêineres normalmente
```bash
docker compose up -d
```

### Parando os contêineres
```bash
docker compose down
```

### Executando migrations no contêiner do backend
Para criar as tabelas no banco de dados:
```bash
docker exec -it bookstore_backend node ace migration:run
```

### Populando o banco com dados de teste (seed)
```bash
docker exec -it bookstore_backend node ace db:seed
```

### Conferindo cache e chaves no Redis
Para acessar o CLI do Redis dentro do contêiner e listar as chaves:
```bash
docker exec -it redis redis-cli
keys *
```

### Conferindo dados no banco PostgreSQL
Você pode se conectar ao banco de dados usando um programa como o DBeaver ou acessar o CLI do PostgreSQL via Docker:
```bash
docker exec -it postgres psql -U postgres
```

Dentro do CLI, conecte-se ao banco de dados do projeto:
```sql
\c bookstore_db
```

A partir daí, você pode executar seus comandos SQL.

### Para testar a aplicação, acesse:
- **Frontend**: http://localhost:4200
- **Backend** (para testes com Postman): http://localhost:3333

## Executando Localmente (sem Docker)

### Pré-requisitos:
- Node.js versão 22+
- Angular CLI instalado globalmente (`npm install -g @angular/cli`)
- PostgreSQL rodando localmente
- Redis rodando localmente

Configure o arquivo `.env` para conectar-se aos seus serviços locais (PostgreSQL e Redis):

```env
# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=bookstore_user
DB_PASSWORD=1234
DB_DATABASE=bookstore_db

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Backend

1. Navegue até a pasta backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install @adonisjs/auth  
node ace configure @adonisjs/auth # (escolha access token)

npm install @adonisjs/lucid
node ace configure @adonisjs/lucid # (escolha postgres)

npm install @adonisjs/redis
node ace configure @adonisjs/redis
```

3. Execute as migrations para criar as tabelas:
```bash
node ace migration:run
```

4. Popule o banco para testes (seed):
```bash
node ace db:seed
```

5. Rode o backend:
```bash
npm run dev
```

### Frontend

1. Navegue até a pasta frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install @angular/material
npm install chart.js
npm install ng2-charts
```

3. Rode a aplicação:
```bash
npm start
# ou
ng serve
```

## Funcionalidades Implementadas

- **Autenticação (JWT)**: Login, registro, logout, e proteção de rotas com guards. Armazenando token tanto no localStorage quanto no banco de dados, e removendo quando fazer logout.

- **Cadastro e Gerenciamento de Livros**: CRUD completo com validações de dados no backend (campos obrigatórios, ISBN único).

- **Rotas e Modulação Angular**: Estrutura modular com módulos Auth e Books (componentes), serviços, guards e roteamento organizado.

- **Listagem com filtros e paginação**: Pesquisa por título, autor, gênero e controle de itens por página. Paginação funcionando.

- **Cache com Redis**: Implementação de uma camada L2 de cache para acelerar consultas frequentes ao banco de dados.

- **Tratamento de erros amigáveis**: Mapeamento de erros do backend para mensagens claras no frontend.

- **Docker**: Contêineres configurados para backend, frontend, banco de dados e Redis, garantindo um ambiente de desenvolvimento consistente e portátil.

- **Gráficos (em desenvolvimento)**: Integração com Chart.js/ng2-charts para futuras estatísticas dos livros.

- **Segurança**: Rotas públicas para listagem e detalhes dos livros, e rotas protegidas (após o login) para ações de criação, edição e exclusão.

## Estrutura do Projeto

```
bookstore/
├── backend/           # API AdonisJS
├── frontend/          # Aplicação Angular
├── docker-compose.yml # Configuração Docker
└── README.md         # Este arquivo
```