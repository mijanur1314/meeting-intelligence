# Meeting Intelligence Service

Full-stack meeting intelligence application built with Express, TypeScript, PostgreSQL, Prisma, Next.js, Gemini, and Telegram.

## Features

- JWT registration, login, refresh, and protected APIs
- Meeting storage with participants and timestamped transcripts
- Gemini analysis for summaries, decisions, action items, and follow-ups
- Zod validation of AI output and verification of every transcript citation
- Owner-scoped action-item management, filters, and overdue detection
- Hourly reminder scheduler with Telegram delivery history
- Trace IDs, structured logging, unified API errors, and Swagger UI

## Requirements

- Node.js 20+
- PostgreSQL 15+ or Docker Desktop
- Gemini API key
- Telegram bot token and chat ID

## Local Setup

```bash
npm ci
Copy-Item backend/.env.example backend/.env
```

Fill in `backend/.env`, then run:

```bash
npm run build:backend
npx prisma migrate deploy --schema backend/prisma/schema.prisma
npm run dev:backend
npm run dev:frontend
```

The frontend defaults to `http://localhost:8000/api`. To change it, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Docker

Create a root `.env` containing `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`, and `TELEGRAM_CHAT_ID`, then run:

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/api-docs`
- Health: `http://localhost:8000/health`

## API Example

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"alice@example.com\",\"password\":\"password123\"}"
```

Use the returned access token:

```bash
curl -X POST http://localhost:8000/api/meetings \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Sprint Planning\",\"date\":\"2026-06-06T10:00:00Z\",\"transcripts\":[{\"timestamp\":\"00:20\",\"speaker\":\"Alice\",\"text\":\"I will prepare release notes.\"}]}"
```

Full request schemas and routes are documented in Swagger.

## Deployment

1. Provision PostgreSQL and set `DATABASE_URL`.
2. Set all variables from `backend/.env.example`.
3. Build with `npm ci && npm run build:backend`.
4. Apply migrations with `npm run migrate:deploy --workspace=backend`.
5. Start with `npm start --workspace=backend`.
6. Build the frontend with `NEXT_PUBLIC_API_URL` set to the public API URL.
7. Set `CANDIDATE_EMAIL`, `REPOSITORY_URL`, and `DEPLOYED_URL` for `/api/evaluation`.

Never commit `.env` files. Rotate any credential that has previously been shared or committed.
