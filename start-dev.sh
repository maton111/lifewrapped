#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Checking PostgreSQL container..."

# Start postgres if not already running
if ! docker compose -f "$ROOT_DIR/docker-compose.yml" ps --status running postgres 2>/dev/null | grep -q postgres; then
  echo "==> Starting PostgreSQL container..."
  docker compose -f "$ROOT_DIR/docker-compose.yml" up -d postgres
fi

echo "==> Waiting for PostgreSQL to be ready..."
until docker compose -f "$ROOT_DIR/docker-compose.yml" exec -T postgres \
  pg_isready -U postgres -d lifewrapped > /dev/null 2>&1; do
  sleep 1
done
echo "==> PostgreSQL is ready!"

echo "==> Starting API..."
cd "$ROOT_DIR/api/LifeWrapped.API"
dotnet run --launch-profile http