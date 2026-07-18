#!/bin/sh
set -e

DATA_DB="/app/data/dev.db"
PRISMA_DB="/app/prisma/dev.db"

mkdir -p /app/data

# First time: seed data volume from the bundled database if it exists
if [ ! -f "$DATA_DB" ]; then
  if [ -f "$PRISMA_DB" ] && [ ! -L "$PRISMA_DB" ]; then
    cp "$PRISMA_DB" "$DATA_DB"
    echo "Seeded database from bundled data"
  else
    touch "$DATA_DB"
  fi
fi

# Symlink from prisma dir to persistent volume
rm -f "$PRISMA_DB"
ln -sf "$DATA_DB" "$PRISMA_DB"

cd /app

# Ensure schema is up to date (regenerates Prisma client after push)
npx prisma db push 2>/dev/null || true

# Seed if this is a fresh database (uses plain Node.js, no ts-node needed)
node prisma/seed.js 2>/dev/null || true

echo "Starting backup service..."
sh /app/backup.sh &

echo "Starting Next.js server..."
exec node server.js
