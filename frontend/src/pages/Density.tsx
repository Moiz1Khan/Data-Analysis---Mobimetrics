import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import { MotionChart } from "../components/MotionChart";
import { lightChartMixin } from "../theme/echarts";
import { useBundle } from "../context/BundleContext";

export function Density() {
  const { densityScreenApps } = useBundle();

  const option = useMemo<EChartsOption>(() => {
    const m = lightChartMixin();
    return {
      ...m,
      legend: {
        data: densityScreenApps.map((d) => d.name),
        textStyle: { color: "#1a1a1a" },
        top: 36,
      },
      xAxis: {
        ...m.xAxis,
        type: "value",
        name: "Screen on time (hrs/day)",
        nameTextStyle: { color: "#454545" },
      },
      yAxis: {
        ...m.yAxis,
        type: "value",
        name: "Density",
        nameTextStyle: { color: "#454545" },
      },
      series: densityScreenApps.map((d) => ({
        type: "line" as const,
        name: d.name,
        data: d.x.map((xi, i) => [xi, d.y[i] ?? 0]),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2.5, color: d.color, shadowBlur: 10, shadowColor: `${d.color}66` },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${d.color}55` },
              { offset: 1, color: `${d.color}05` },
            ],
          },
        },
      })),
    };
  }, [densityScreenApps]);

  return (
    <>
      <h2 className="page-title">Density</h2>
      <MotionChart title="Kernel density (screen time)" delay={0}>
        <ReactECharts option={option} style={{ height: 420 }} opts={{ renderer: "canvas" }} />
      </MotionChart>
    </>
  );
}
