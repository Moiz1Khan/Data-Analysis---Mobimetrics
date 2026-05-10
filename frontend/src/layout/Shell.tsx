import { AnimatePresence, motion } from "framer-motion";
import { Suspense } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { PRODUCT_NAME, PRODUCT_TAGLINE } from "../branding";

function PageFallback() {
  return (
    <div className="loading-screen" style={{ minHeight: 240 }}>
      <div
        className="loading-spinner"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "2px solid rgba(0,0,0,0.12)",
          borderTopColor: "#111",
          animation: "loadingSpin 0.85s linear infinite",
        }}
      />
      <span style={{ color: "var(--muted)" }}>Loading view…</span>
    </div>
  );
}

const links = [
  ["/", "Home"],
  ["/overview", "Overview"],
  ["/descriptive", "Descriptive stats"],
  ["/boxplots", "Boxplots"],
  ["/histograms", "Histograms"],
  ["/regression", "Regression"],
  ["/bars", "Bar charts"],
  ["/density", "Density plot"],
] as const;

export function Shell() {
  const loc = useLocation();

  return (
    <>
      <header className="app-header">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="app-header-inner"
        >
          <Link to="/" className="app-header-brand">
            <h1>{PRODUCT_NAME}</h1>
            <p>{PRODUCT_TAGLINE}</p>
          </Link>
        </motion.div>
      </header>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-label">Navigate</div>
          <nav>
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="page-main">
          <Suspense fallback={<PageFallback />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={loc.pathname}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    </>
  );
}
