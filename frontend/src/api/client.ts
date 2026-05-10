import type { Bundle } from "./types";

/** In dev, Vite proxies `/api` to the local FastAPI server. On Vercel, set `VITE_API_URL` to your deployed API origin (no trailing slash), e.g. `https://mobimetrics-api.railway.app`. */
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export async function fetchBundle(): Promise<Bundle> {
  const path = "/api/bundle";
  const url = API_ORIGIN ? `${API_ORIGIN}${path}` : path;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<Bundle>;
}
