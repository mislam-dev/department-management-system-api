# 🚀 What's New

This major release introduces several months of development, bringing powerful new features including AI-driven scheduling, real-time communication, and comprehensive payment gateways. Under the hood, we've completely overhauled our observability stack and optimized performance with advanced caching mechanisms.

## ✨ New Features

### Core Management & Academic Tools

- **AI Course Scheduler:** Introduced an AI Agent for dynamic, conflict-free course schedule generation. Processing is handled via background jobs to ensure a smooth user experience.
- **Teacher Management:** Added comprehensive tracking for Teacher Attendance and specific Unavailability periods.
- **Room Management:** New module to manage and allocate physical spaces across Classrooms, Labs, and Offices.
- **Fee Management:** Added a dedicated module to track, manage, and process student fees effectively.

### Payments & Integrations

- **Multi-Gateway Payment System:** Built a robust payment gateway supporting multiple providers.
- **Provider Integrations:** Successfully integrated **Stripe** and **SSLCommerz** for secure and seamless transactions.

### Real-Time Communication

- **WebSocket Messenger:** Launched a fully functional real-time chat application.
- **Chat Features:** Supports one-to-one messaging, group chats, and an exclusive admin-only broadcast/chat feature.

### Performance Optimizations

- **Redis Caching Engine:** Introduced Redis for application-wide caching.
- **Global Interceptors:** Implemented global interceptors to seamlessly handle caching and automated cache invalidation, significantly reducing database load.

---

## 🛠 Chores, DX, & Technical Debt

### Architecture & Developer Experience (DX)

- **Module Restructuring:** Completely reorganized the codebase, grouping modules logically by functionality and domain for better scalability.
- **Commitlint:** Enforced standard commit conventions across the repository.
- **Husky Pre-commit Hooks:** Integrated Husky to automatically run and pass test cases strictly on staged files before allowing commits, ensuring code stability.

### Observability, Logging, & Tracing

- **Default Logger:** Replaced the standard logger with **Winston**, supporting advanced file and console logging out of the box.
- **Full Monitoring Stack:** Added a complete infrastructure monitoring solution using **Loki, Promtail, Prometheus, and Grafana**.
- **Error Tracking:** Integrated **Sentry** for real-time error tracing, alerting, and debugging.

## New Tools & Technologies Introduced

This document outlines the new tools, frameworks, services, and integrations added to the Department Management System (DMS) during the latest development cycle.

### 🤖 Artificial Intelligence

- **Google Generative AI:** Integrated to power the new AI Agent responsible for dynamic, conflict-free course schedule generation.

### 💳 Finance & Payments

- **Stripe:** Integrated as a primary payment gateway for secure, reliable fee processing.
- **SSLCommerz:** Added to support localized, multi-channel payment processing for student fees.

### ⚡ Performance, Caching & Background Jobs

- **Redis:** Implemented as the core caching engine (utilizing global interceptors) to significantly reduce database load and improve response times.
- **BullMQ:** Utilized alongside Redis to handle robust background job processing, specifically to manage heavy tasks like AI schedule generation without blocking the main event loop.

### 💬 Real-Time Communication

- **WebSockets / Socket.IO:** Added to facilitate real-time, bidirectional communication for the newly introduced Messenger module, supporting one-to-one, group, and admin-only broadcasts.

### 📊 Observability, Logging & Tracing

- **Winston:** Replaced the default NestJS logger to provide advanced, customizable file and console logging capabilities.
- **Prometheus & Grafana:** Integrated to collect, monitor, and visualize application metrics and infrastructure health.
- **Loki & Promtail:** Added to securely aggregate and query logs effectively across the containerized application environment.
- **Sentry:** Implemented for real-time application error tracking, alerting, and debugging.

### 🛠 Developer Experience (DX) & Code Quality

- **Husky:** Introduced as a Git hook tool to automatically enforce pre-commit checks, ensuring test cases run successfully on staged files before allowing a commit.
- **Commitlint:** Added to strictly enforce standardized commit message formatting across the repository.

---

---

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
