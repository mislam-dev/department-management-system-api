# DMS (NestJS) — Project Overview

Department Management System (DMS) — a modular NestJS API for managing users, courses, schedules, attendance, notices, activities, and reports. The project integrates with Auth0 for authentication and role management, exposes a Swagger/OpenAPI UI, and is designed for containerized deployment.

## Project Structure

```

├── 📁 .husky
├── 📁 public
├── 📁 src
│   ├── 📁 activity
│   ├── 📁 attendance
│   ├── 📁 auth # authentication module
│   ├── 📁 auth0 # auth0 module
│   ├── 📁 config # configuration
│   ├── 📁 course
│   ├── 📁 course_schedule
│   ├── 📁 notice
│   ├── 📁 pagination
│   ├── 📁 report
│   ├── 📁 semester
│   ├── 📁 student
│   ├── 📁 swagger # swagger api docs
│   ├── 📁 teacher
│   ├── 📁 types
│   ├── 📁 user
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
- User management (students, teachers, admin staff)
- Course and semester management
- Course scheduling with overlap validation (room/teacher/time checks)
- Attendance recording and reporting
- Notices and activity feed CRUD endpoints
- Report generation and export (server-side)
- API documentation via Swagger with a custom theme

## Technologies used (details)

- NestJS — server-side framework used for modular architecture, dependency injection, middleware, pipes, and guards.
- TypeORM — entity management, migrations, and DB access
- Auth0 — identity provider for user authentication and M2M management interactions
- class-validator & class-transformer — request DTO validation with custom validators in feature modules.
- Swagger / OpenAPI — automatic API documentation
- Docker & docker-compose — containerized development and production deployments.
- TypeScript — language used across the codebase with strict typing.

## Installation & Quick Start

Prerequisites:

- Node.js (LTS) and `pnpm` recommended
- A running database instance (Postgres) or configured connection
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
