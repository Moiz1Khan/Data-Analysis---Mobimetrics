import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fetchBundle } from "../api/client";
import type { Bundle } from "../api/types";

const BundleContext = createContext<Bundle | null>(null);

export function BundleProvider({ children }: { children: ReactNode }) {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchBundle()
      .then(setBundle)
      .catch((e: Error) => setErr(e.message));
  }, []);

  if (err) {
    return (
      <div className="error-banner">
        Could not load data. Start the API:{" "}
        <code style={{ color: "#0d47a1" }}>
          cd backend &amp;&amp; uvicorn main:app --reload --port 8000
        </code>
        <br />
        <small>{err}</small>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="loading-screen">
        <LoadingRing />
        <span>Loading analytics bundle…</span>
      </div>
    );
  }

  return (
    <BundleContext.Provider value={bundle}>{children}</BundleContext.Provider>
  );
}

function LoadingRing() {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "2px solid rgba(0,0,0,0.1)",
        borderTopColor: "#0a0a0a",
        animation: "loadingSpin 0.85s linear infinite",
      }}
    />
  );
}

export function useBundle(): Bundle {
  const b = useContext(BundleContext);
  if (!b) throw new Error("useBundle outside provider");
  return b;
}
