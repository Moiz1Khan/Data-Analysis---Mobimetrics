# Mobimetrics

**Mobimetrics** is a mobile usage analytics project: a **FastAPI** backend serves a cached JSON bundle from `mobileusage.csv`, and a **React + TypeScript** (Vite) front end provides a **Mobimetrics** dashboard with **Framer Motion** and **Apache ECharts**.

- **Landing page** (`/`) introduces the dataset and what the stack does.
- **Dashboard** routes (`/overview`, …) load the bundle once and render tables and charts.

## Prerequisites

- Python 3.10+ with `pip`
- Node 18+ with `npm`

## Run locally

**1. API (terminal 1)**

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**2. Front end (terminal 2)**

```bash
cd frontend
npm install
npm run dev
```

Open **http://127.0.0.1:5173** — start on the **Mobimetrics** home page; use **Open dashboard** or **Dashboard** for analytics. Vite proxies `/api` to the backend.
