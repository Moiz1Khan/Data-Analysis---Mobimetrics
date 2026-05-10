import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PRODUCT_NAME, PRODUCT_SHORT, PRODUCT_TAGLINE } from "../branding";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export function Landing() {
  return (
    <div className="landing">
      <header className="landing-top">
        <motion.div
          className="landing-top-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link to="/" className="landing-logo">
            {PRODUCT_NAME}
          </Link>
          <Link to="/overview" className="landing-cta-top">
            Dashboard
          </Link>
        </motion.div>
      </header>

      <main className="landing-main">
        <motion.section
          className="landing-hero"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          animate="show"
        >
          <motion.p className="landing-eyebrow" variants={fadeUp}>
            Dataset & analytics project
          </motion.p>
          <motion.h1 className="landing-title" variants={fadeUp}>
            {PRODUCT_NAME}
          </motion.h1>
          <motion.p className="landing-tagline" variants={fadeUp}>
            {PRODUCT_TAGLINE}
          </motion.p>
          <motion.p className="landing-lead" variants={fadeUp}>
            {PRODUCT_SHORT}
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/overview" className="landing-cta-primary">
              Open dashboard
            </Link>
          </motion.div>
        </motion.section>

        <motion.section
          className="landing-panel"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
        >
          <h2>About the dataset</h2>
          <p>
            The project uses a tabular <strong>mobile usage</strong> dataset (<code>mobileusage.csv</code>
            ): one row per user/device with daily-style measures such as app usage time, screen-on time,
            battery drain, data usage, number of apps installed, operating system, gender, device model, and
            age. Age groups are derived for faceted charts when not already present.
          </p>
          <ul className="landing-list">
            <li>Numeric usage and device metrics (minutes, hours, mAh, MB, app counts)</li>
            <li>Categories: OS, gender, device model</li>
            <li>Demographics: age and derived age bands for histograms</li>
          </ul>
        </motion.section>

        <motion.section
          className="landing-panel"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.45 }}
        >
          <h2>What we built</h2>
          <p>
            <strong>{PRODUCT_NAME}</strong> pairs a small <strong>Python (FastAPI)</strong> service with a{" "}
            <strong>React + TypeScript</strong> front end. The API loads the CSV once, precomputes summaries
            and chart-ready series, and exposes a single <code>/api/bundle</code> endpoint so the UI stays
            responsive. The dashboard includes overview tables, descriptive KPIs, boxplots, histograms by age
            group, regression-style scatter plots with fitted lines, bar charts by device model, and density
            curves split by high vs. low app counts.
          </p>
        </motion.section>
      </main>

      <footer className="landing-footer">
        <span>{PRODUCT_NAME}</span>
        <span className="landing-footer-muted">Built with FastAPI · React · TypeScript · ECharts</span>
      </footer>
    </div>
  );
}
