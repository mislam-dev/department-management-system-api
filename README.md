# DMS (NestJS) — Project Overview

Department Management System (DMS) — a modular NestJS API for managing users, academic operations, attendance, finance, messaging, and reporting. The project integrates with Auth0 for authentication and role management, exposes a Swagger/OpenAPI UI, and is designed for containerized deployment.

## Project Structure

```
├── 📁 .husky
├── 📁 public
├── 📁 src
│   ├── 📁 common
│   ├── 📁 core # database, auth, config, swagger, seeder
│   ├── 📁 modules
│   │   ├── 📁 academic # course, semester, schedule management
│   │   ├── 📁 attendance # student attendance tracking
│   │   ├── 📁 finance # payment gateways (Stripe, SSLCommerz)
│   │   ├── 📁 identity # user & role management
│   │   ├── 📁 messenger # real-time chat & websockets
│   │   └── 📁 reporting # report generation
│   ├── 📁 types # typescript types/interfaces
│   ├── 📄 app.controller.ts
│   ├── 📄 app.module.ts
│   ├── 📄 app.service.ts
│   └── 📄 main.ts
├── ⚙️ .dockerignore
├── ⚙️ .env.example
├── ⚙️ .gitignore
├── ⚙️ .prettierrc
├── 🐳 Dockerfile
├── 📄 Dockerfile.prod
├── 📝 README.md
├── 📄 commitlint.config.ts
├── ⚙️ docker-compose.prod.yaml
├── ⚙️ docker-compose.yaml
├── 📄 eslint.config.mjs
├── ⚙️ nest-cli.json
├── ⚙️ package.json
├── ⚙️ pnpm-lock.yaml
└── ⚙️ tsconfig.json
```

## Features

- Authentication & authorization using Auth0 (support for roles and guards)
- Identity management (students, teachers, admin staff)
- Academic management (courses, semesters, and course scheduling)
- Attendance tracking and record-keeping
- Real-time messaging using WebSockets (`messenger` module)
- Finance and payment integration (Stripe, SSLCommerz)
- Background job processing using BullMQ and Redis
- AI Integration (Google Generative AI) for automated tasks
- Comprehensive API documentation via Swagger

## Technologies used (details)

- NestJS — server-side framework used for modular architecture, dependency injection, middleware, pipes, and guards.
- TypeORM — entity management, migrations, and DB access via PostgreSQL
- Auth0 — identity provider for user authentication and M2M management interactions
- class-validator & class-transformer — request DTO validation with custom validators in feature modules.
- Swagger / OpenAPI — automatic API documentation
- WebSockets / Socket.IO — real-time bidirectional event-based communication
- BullMQ / Redis — robust message queue handling for background jobs
- Stripe & SSLCommerz — secure payment gateway integrations
- Docker & docker-compose — containerized development and production deployments.
- TypeScript — language used across the codebase with strict typing.

## Installation & Quick Start

Prerequisites:

- Node.js (LTS) and `pnpm` recommended
- Running database (Postgres) and Redis instances, or use the provided Docker Compose setup
- Auth0 account and credentials if you want to enable full auth integration

1. Clone repository

```bash
git clone <repo-url> dms-api
cd dms-api
```

2. Install dependencies

```bash
pnpm install
```

3. Create environment file

Copy `.env.example` (if present) to `.env` and populate required values:

```bash
cp .env.example .env
```

4. Run database migrations / sync

Depending on the project configuration you may either run migrations or rely on TypeORM sync

5. Run the app

Development:

```bash
pnpm run start:dev
```

Production (build + start):

```bash
pnpm run build
pnpm run start:prod
```

6. API documentation

After the app is running, open the Swagger UI (default path: `/docs`).

7. Docker (optional)

Build and run with Docker Compose:

```bash
docker compose up --build
```

Or use the provided `Dockerfile` and `docker-compose.yaml` for customization.

## Running tests & linting

- Unit tests:

```bash
pnpm run test
```

- E2E tests:

```bash
pnpm run test:e2e
```

- Linting:

```bash
pnpm run lint
```

## Contact

Example placeholder:

- Email: mmislam027@gmail.com.com
- GitHub: `https://github.com/mislam-dev`
