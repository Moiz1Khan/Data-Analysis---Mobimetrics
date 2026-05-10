import { motion } from "framer-motion";
import type { CSSProperties } from "react";

const accents: Record<string, string> = {
  purple: "#a78bfa",
  blue: "#38bdf8",
  green: "#34d399",
  orange: "#fb923c",
  red: "#f87171",
  yellow: "#fbbf24",
  teal: "#2dd4bf",
};

export function KpiMotion({
  label,
  value,
  accent,
  i,
}: {
  label: string;
  value: string;
  accent: keyof typeof accents;
  i: number;
}) {
  const line = accents[accent] ?? accents.blue;
  return (
    <motion.div
      className="kpi"
      style={{ "--kpi-line": line } as CSSProperties}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, y: -3 }}
    >
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
    </motion.div>
  );
}
