import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import type { HistAge } from "../api/types";
import { lightChartMixin } from "../theme/echarts";
import { useBundle } from "../context/BundleContext";

export function Histograms() {
  const { histScreenByAge } = useBundle();

  return (
    <>
      <h2 className="page-title">Screen-on time by age group</h2>
      <div className="hist-grid">
        {histScreenByAge.map((h, idx) => (
          <HistCell key={h.ageGroup} h={h} idx={idx} />
        ))}
      </div>
    </>
  );
}

function HistCell({ h, idx }: { h: HistAge; idx: number }) {
  const option = useMemo<EChartsOption>(() => {
    const m = lightChartMixin();
    if (!h.bins.length) {
      return {
        ...m,
        xAxis: { ...m.xAxis, type: "category", data: [] },
        yAxis: { ...m.yAxis, type: "value" },
        series: [{ type: "bar", data: [] }],
      };
    }
    const labels = h.bins.map((b) => ((b.start + b.end) / 2).toFixed(1));
    const counts = h.bins.map((b) => b.count);
    return {
      ...m,
      grid: { ...m.grid, top: 28, bottom: 36 },
      xAxis: {
        ...m.xAxis,
        type: "category",
        data: labels,
        axisLabel: { rotate: 45, color: "#454545", fontSize: 9 },
      },
      yAxis: { ...m.yAxis, type: "value", name: "Count", nameTextStyle: { color: "#454545" } },
      series: [
        {
          type: "bar",
          data: counts,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#38bdf8" },
                { offset: 1, color: "rgba(56,189,248,0.15)" },
              ],
            },
            borderRadius: [6, 6, 0, 0],
          },
        },
      ],
    };
  }, [h]);

  return (
    <motion.div
      className="chart-shell hist-cell"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
    >
      <h4>Age {h.ageGroup}</h4>
      <ReactECharts option={option} style={{ height: 220 }} opts={{ renderer: "canvas" }} />
    </motion.div>
  );
}
