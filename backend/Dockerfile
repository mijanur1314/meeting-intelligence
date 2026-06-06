FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package and lock
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies for workspace
RUN npm ci

# Copy source
COPY backend/ ./backend/

WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma

WORKDIR /app/backend
EXPOSE 8000

CMD ["sh", "-c", "npm run migrate:deploy && npm start"]
