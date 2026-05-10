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

Serve `frontend/dist` with a static host and point the browser at your deployed API (see **`VITE_API_URL`** below).

## Deploying the API on [Render](https://render.com)

Use a **Web Service** connected to this GitHub repo.

1. **Root Directory** — leave **empty** (repository root) so **`mobileusage.csv`** is next to **`backend/`** (the API resolves the CSV from the repo root).
2. **Environment** — **Python 3** (or your preferred version).
3. **Build command:**

   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Start command:**

   ```bash
   cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

   Render sets **`PORT`** automatically.

5. **Environment variable** — add **`ALLOWED_ORIGINS`** with your front-end origin(s), comma-separated, e.g.  
   `https://your-app.vercel.app`  
   (add preview URLs too if you use them.)

6. After deploy, open **`https://<your-service>.onrender.com/api/health`** — expect `{"ok":true}`.

## Deploying the front end on [Vercel](https://vercel.com)

1. **New Project** → import this repo → set **Root Directory** to **`frontend`**.
2. **Environment variables:** **`VITE_API_URL`** = your **Render** service URL **only**, **no** trailing slash, e.g. `https://mobimetrics-api.onrender.com`.
3. Deploy. **`frontend/vercel.json`** sends all routes to **`index.html`** for React Router.
4. Put your **Vercel** URL(s) into Render’s **`ALLOWED_ORIGINS`** and redeploy the API if the dashboard shows CORS errors.

**Local dev:** leave **`VITE_API_URL`** unset so the app uses **`/api`** and the Vite dev proxy.
