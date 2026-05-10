# Mobimetrics API — Fly.io / container deploy
# Expects repo root as build context so mobileusage.csv and backend/ are both available.
FROM python:3.12-slim-bookworm

WORKDIR /app

COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY mobileusage.csv /app/mobileusage.csv
COPY backend/ /app/backend/

WORKDIR /app/backend

EXPOSE 8080
ENV PORT=8080
CMD uvicorn main:app --host 0.0.0.0 --port 8080
