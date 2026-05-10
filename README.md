# Mobimetrics

**Mobimetrics** is a mobile usage analytics project: a **FastAPI** backend serves a cached JSON bundle from `mobileusage.csv`, and a **React + TypeScript** (Vite) front end provides a **Mobimetrics** dashboard with **Framer Motion** and **Apache ECharts**.

- **Landing page** (`/`) introduces the dataset and what the stack does.
- **Dashboard** routes (`/overview`, …) load the bundle once and render tables and charts.

## Prerequisites

- Python 3.10+ with `pip`
- Node 18+ with `npm`

## Run

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

## Production build

```bash
cd frontend && npm run build
```

Serve `frontend/dist` with a static host and point `/api` at the FastAPI service (update CORS in `backend/main.py` if the origin changes).

## Deploying on Vercel (front end)

Vercel fits the **Vite/React** app well. The **FastAPI** service is not a drop-in static file: run it on a Python host (e.g. [Railway](https://railway.app), [Render](https://render.com), or [Fly.io](https://fly.io)) and point the UI at that URL.

1. Deploy **backend** (same repo: set start command to run Uvicorn from `backend/`, working directory so `mobileusage.csv` at repo root is found, or copy the CSV into the runtime image).
2. Set **`ALLOWED_ORIGINS`** on the API to your Vercel URL(s), comma-separated, e.g. `https://mobimetrics.vercel.app,https://mobimetrics-xxx.vercel.app`.
3. In Vercel: **New Project** → import the GitHub repo → set **Root Directory** to `frontend`.
4. Under **Environment Variables**, add **`VITE_API_URL`** = your public API origin with **no** trailing slash (e.g. `https://mobimetrics-api.up.railway.app`).
5. Deploy. `frontend/vercel.json` sends all routes to `index.html` for React Router.

Local dev is unchanged: leave `VITE_API_URL` unset so requests use `/api` and the Vite proxy.
