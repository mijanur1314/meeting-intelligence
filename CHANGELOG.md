# Changelog

All notable changes to the Meeting Intelligence Service will be documented in this file.

## [1.1.0] - 2026-06-06

### Fixed
- Registration initialization, password validation consistency, error display, and integration-test timeout.
- Missing analysis routes and meeting-list response shape.
- Frontend API types, analysis rendering, lint failures, and Docker build contexts.

### Added
- Owner-scoped action-item service and Zod validators.
- Strict AI output schema and transcript-citation verification.
- Initial Prisma migration and query indexes.
- Complete route-level OpenAPI documentation.
- Grounding and action-item validation tests.
- Verified live Gemini analysis and Telegram reminder delivery.

## [1.0.0] - 2026-06-05

### Added
- **Monorepo Setup**: Initialized npm workspaces separating `backend` and `frontend`.
- **Database & Schema**: Integrated PostgreSQL with Prisma ORM. Created models for `User`, `Meeting`, `Transcript`, `Analysis`, `ActionItem`, and `ReminderHistory`.
- **Authentication**: Implemented JWT-based session management (`/auth/register`, `/auth/login`) with `bcrypt` password hashing.
- **Meeting Core**: Full CRUD endpoints for Meetings with strict `Zod` validation.
- **AI Intelligence**: Integrated `@google/generative-ai` (Gemini 2.5 Flash). Created a heavily constrained prompt to strictly extract summaries, decisions, and action items with exact transcript timestamp citations to prevent hallucination.
- **Action Item Tracker**: Endpoints to list and `PATCH` task statuses.
- **Scheduler & Reminders**: Implemented `node-cron` job to scan for overdue action items and dispatch notifications via the **Telegram Bot API**.
- **Global Error Handling & Traceability**: Injected unified JSON response format and standard Trace IDs across all routes, tracked via Winston structured logging.
- **API Documentation**: Served an OpenAPI 3.0 specification via Swagger UI at `/api-docs`.
- **Dockerization**: Wrote multi-stage `Dockerfile` configurations and a `docker-compose.yml` for unified deployment.
- **Next.js Frontend**: Built a responsive, dark-mode dashboard using Next.js 15, Tailwind CSS, and React Query to visualize meetings and their AI-extracted citations.
- **Documentation**: Generated complete `README.md`, `DECISIONS.md`, `AI_APPROACH.md`, `TESTING.md`, `CHECKLIST.md`, and `CHANGELOG.md`.
