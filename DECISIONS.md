# Technical Decisions

## PostgreSQL and Prisma

PostgreSQL provides relational ownership and cascade behavior for meetings, transcripts, tasks, and reminders. Prisma provides typed queries and migrations. MongoDB was considered, but the ownership and filtering requirements fit relational constraints better. JSONB is limited to flexible AI insight and citation payloads.

## JWT Authentication

Short-lived access tokens and seven-day refresh tokens keep protected APIs stateless and simple to deploy. Server sessions were considered, but would add shared session storage. Tokens stored in browser local storage are simple for this assignment, though secure HTTP-only cookies would be preferable for a production browser application.

## Gemini

Gemini is called through the official SDK with low-temperature JSON output. Prompt instructions alone were considered insufficient, so responses also pass strict schema and transcript-citation validation before persistence.

## Telegram Integration

Telegram offers a real, inexpensive API and straightforward delivery for scheduled reminders. Slack and email were considered; Telegram requires less workspace/provider setup for evaluation. Reminder attempts are stored as `SUCCESS` or `FAILED`.

## Project Structure

The npm-workspace monorepo keeps frontend and backend independently buildable while sharing one installation. Backend layers separate routes, validation, controllers, services, repositories, and Prisma initialization.

## Scheduler

An hourly `node-cron` process is suitable for a single-instance internship deployment. A durable queue or managed scheduler would be preferable when scaling across replicas because in-process cron can duplicate work after horizontal scaling.
