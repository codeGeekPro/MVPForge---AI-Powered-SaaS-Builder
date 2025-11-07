#!/usr/bin/env bash
set -euo pipefail

# Start minimal infra for local dev: Redis (and Postgres optional)
echo "Starting Redis and Postgres via docker-compose..."

docker compose up -d redis postgres

echo "Waiting for Redis to be healthy (up to 30s)..."
for i in {1..30}; do
  STATUS=$(docker inspect --format='{{.State.Health.Status}}' mvpforge-redis 2>/dev/null || echo "none")
  if [ "$STATUS" = "healthy" ]; then
    echo "Redis is healthy"
    break
  fi
  sleep 1
done

# Start backend (in another terminal you can run frontend with pnpm dev)
echo "Starting backend (nodemon)..."
cd backend
pnpm dev
