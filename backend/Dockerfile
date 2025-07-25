FROM python:3.11-slim

WORKDIR /app

# ensure apt-cache is fresh, install netcat, clean up
RUN apt-get update \
 && apt-get install -y --no-install-recommends netcat-openbsd  \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/
COPY .env .env

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
