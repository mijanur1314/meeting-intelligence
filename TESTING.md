# Testing

## Automated Scenarios

- Successful registration against PostgreSQL
- Password length validation
- Invalid action-item status rejection
- Malformed meeting ID rejection
- Acceptance of grounded AI output
- Rejection of missing and nonexistent AI citations
- Backend TypeScript production build
- Frontend TypeScript, ESLint, and production build
- Prisma schema and migration validation
- Live Gemini analysis with grounded timestamp/speaker citations
- Live Telegram reminder delivery

Run:

```bash
npm test --workspace=backend -- --runInBand
npm run build:backend
npm run build:frontend
```

The registration integration test uses `DATABASE_URL`; use a dedicated test database in CI.

## Edge Cases

- Duplicate registration
- Missing or invalid bearer tokens
- Invalid UUIDs, dates, emails, and action-item statuses
- Empty transcripts
- Cross-user action-item access
- Completed tasks excluded from overdue results
- Duplicate reminders suppressed for 24 hours

## Remaining Manual Checks

- Public deployment, CORS, Swagger, and evaluation endpoints
