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

## Deploying the API on [Fly.io](https://fly.io)

The repo includes a **`Dockerfile`** and **`fly.toml`** so the FastAPI app and root-level **`mobileusage.csv`** ship together.

1. Install **`flyctl`** ([install guide](https://fly.io/docs/hands-on/install-flyctl/)) and run **`fly auth login`**.
2. Open **`fly.toml`** and set **`app`** to a **globally unique** name on Fly (e.g. `mobimetrics-api-yourname`). If the name is taken, deployment will fail until you change it.
3. From the **repository root** (where `Dockerfile` lives), run:

   ```bash
   fly launch
   ```

   Choose to use the existing **`Dockerfile`** when prompted. You can accept defaults or tweak region; **`internal_port`** must stay **8080** to match the container.

4. Set CORS so your Vercel site can call the API:

   ```bash
   fly secrets set ALLOWED_ORIGINS="https://YOUR-VERCEL-APP.vercel.app"
   ```

   Use a **comma-separated** list if you have production and preview URLs, e.g.  
   `https://mobimetrics.vercel.app,https://mobimetrics-git-main-xxx.vercel.app`

5. Deploy (or redeploy after secrets):

   ```bash
   fly deploy
   ```

6. Your API base URL will look like **`https://<app-name>.fly.dev`**. Test **`https://<app-name>.fly.dev/api/health`** — expect `{"ok":true}`.

See Fly’s [pricing](https://fly.io/docs/about/pricing/) and [autostop/autostart](https://fly.io/docs/launch/autostop-autostart/) if you use `min_machines_running = 0` (first request can be slower while a machine starts).

## Deploying on Vercel (front end)

1. In [Vercel](https://vercel.com): **New Project** → import this GitHub repo → set **Root Directory** to **`frontend`**.
2. **Environment variables**: **`VITE_API_URL`** = your Fly API origin **only**, **no** trailing slash, e.g. `https://mobimetrics-api-yourname.fly.dev`.
3. Deploy. **`frontend/vercel.json`** routes all paths to **`index.html`** for React Router.
4. Add that same Vercel URL (and any preview URLs you use) to Fly **`ALLOWED_ORIGINS`**, then run **`fly deploy`** again if needed.

Local dev: leave **`VITE_API_URL`** unset so the app uses **`/api`** and the Vite dev proxy.
