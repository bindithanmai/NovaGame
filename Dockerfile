# ── Stage 1: build native modules ─────────────────────────────────────────────
# better-sqlite3 needs node-gyp (Python + C compiler). We compile here and
# copy only the finished node_modules to the lean runtime stage.
FROM node:20-alpine AS builder

# Build tools for native addons (better-sqlite3 uses node-gyp)
RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install --production

# ── Stage 2: lean runtime image ───────────────────────────────────────────────
# node:20-alpine is ~50 MB and supports linux/arm64 (Pi 4/5) and linux/arm/v7 (Pi 3).
FROM node:20-alpine

WORKDIR /app

# Copy compiled node_modules from builder
COPY --from=builder /app/server/node_modules ./server/node_modules

# Copy the whole game (static files + server source)
COPY . .

# Persistent data directory for SQLite — mount a volume here
RUN mkdir -p /app/data

EXPOSE 3000

# Health-check used by Docker and docker-compose
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000/health || exit 1

CMD ["node", "server/index.js"]
