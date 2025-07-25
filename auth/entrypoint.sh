#!/bin/sh

echo "Waiting for postgres..."

# Try up to 30 times (30 seconds)
for i in $(seq 1 30); do
  nc -z db 5432 && break
  echo "Postgres not ready yet... ($i)"
  sleep 1
done

nc -z db 5432
if [ $? -ne 0 ]; then
  echo "Postgres not reachable after 30 seconds, giving up."
  exit 1
fi

echo "Postgres is up - starting Auth Service"

exec uvicorn app.main:app --host 0.0.0.0 --port 8001
