FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/

RUN npm ci

COPY frontend/ ./frontend/

WORKDIR /app/frontend
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM node:20-alpine

WORKDIR /app/frontend

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/frontend/.next/standalone /app
COPY --from=builder /app/frontend/.next/static /app/frontend/.next/static
COPY --from=builder /app/frontend/public /app/frontend/public

EXPOSE 3000

CMD ["node", "server.js"]
