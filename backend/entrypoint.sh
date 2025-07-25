#!/bin/sh

# Wait for Postgres to be ready
echo "Waiting for postgres..."

while ! nc -z db 5432; do
  sleep 1
done

echo "Postgres is up - starting FastAPI"

# Run migrations or create tables here if you wish (optional)
# python app/init_db.py

exec uvicorn app.main:app --host 0.0.0.0 --port 8000