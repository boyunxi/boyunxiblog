#!/bin/sh
# Auto-backup script: runs every 10 minutes, keeps max 50 rolling backups
# Also preserves the last backup of each day as a daily snapshot

set -e

DB_PATH="/app/data/dev.db"
BACKUP_DIR="/app/data/backups"
ROLLING_DIR="$BACKUP_DIR/rolling"
DAILY_DIR="$BACKUP_DIR/daily"
MAX_ROLLING=50

mkdir -p "$ROLLING_DIR" "$DAILY_DIR"

do_backup() {
  if [ ! -f "$DB_PATH" ]; then
    echo "[Backup] Database not found, skipping."
    return
  fi

  TS=$(date +%Y%m%d_%H%M)
  TODAY=$(date +%Y%m%d)

  # 1. Rolling backup
  cp "$DB_PATH" "$ROLLING_DIR/dev.db.$TS"
  echo "[Backup] Rolling: dev.db.$TS"

  # 2. Daily snapshot (overwrite to keep only the last of the day)
  cp "$DB_PATH" "$DAILY_DIR/dev.db.$TODAY"
  echo "[Backup] Daily: dev.db.$TODAY"

  # 3. Prune rolling backups to keep only the latest $MAX_ROLLING
  COUNT=$(ls -1 "$ROLLING_DIR" 2>/dev/null | wc -l)
  if [ "$COUNT" -gt "$MAX_ROLLING" ]; then
    DELETE=$((COUNT - MAX_ROLLING))
    ls -1t "$ROLLING_DIR" | tail -n "$DELETE" | while read -r f; do
      rm -f "$ROLLING_DIR/$f"
      echo "[Backup] Pruned: $f"
    done
  fi

  echo "[Backup] Status: rolling=$(ls -1 "$ROLLING_DIR" 2>/dev/null | wc -l) daily=$(ls -1 "$DAILY_DIR" 2>/dev/null | wc -l)"
}

# Immediate first backup
do_backup

while true; do
  sleep 600
  do_backup
done
