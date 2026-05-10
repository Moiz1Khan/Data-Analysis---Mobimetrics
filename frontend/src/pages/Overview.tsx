import { motion } from "framer-motion";
import { useBundle } from "../context/BundleContext";

export function Overview() {
  const { records, columns } = useBundle();

  return (
    <>
      <h2 className="page-title">Dataset overview</h2>
      <motion.div
        className="data-table-wrap"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((row, ri) => (
              <tr key={ri}>
                {columns.map((c) => (
                  <td key={c}>{formatCell(row[c])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </>
  );
}

function formatCell(v: string | number | null | undefined) {
  if (v === null || v === undefined) return "—";
  return String(v);
}
