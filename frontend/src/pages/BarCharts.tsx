import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import { MotionChart } from "../components/MotionChart";
import type { BarRow } from "../api/types";
import { lightChartMixin } from "../theme/echarts";
import { useBundle } from "../context/BundleContext";

const MODEL = "Device Model";

function barOption(rows: BarRow[], yName: string): EChartsOption {
  const m = lightChartMixin();
  const names = rows.map((r) => String(r[MODEL]));
  const vals = rows.map((r) => Number(r.value));
  return {
    ...m,
    xAxis: {
      ...m.xAxis,
      type: "category",
      data: names,
      axisLabel: { rotate: 40, color: "#454545", fontSize: 10 },
    },
    yAxis: { ...m.yAxis, type: "value", name: yName, nameTextStyle: { color: "#454545" } },
    series: [
      {
        type: "bar",
        data: vals,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#38bdf8" },
              { offset: 1, color: "rgba(167,139,250,0.85)" },
            ],
          },
          borderRadius: [8, 8, 0, 0],
          shadowBlur: 12,
          shadowColor: "rgba(56,189,248,0.25)",
        },
      },
    ],
  };
}

export function BarCharts() {
  const { barScreenByModel, barBatteryByModel } = useBundle();

  const o1 = useMemo(() => barOption(barScreenByModel, "Hours/day"), [barScreenByModel]);
  const o2 = useMemo(() => barOption(barBatteryByModel, "mAh/day"), [barBatteryByModel]);

  return (
    <>
      <h2 className="page-title">Bar charts</h2>
      <div className="grid-2">
        <MotionChart title="Average screen-on time" delay={0}>
          <ReactECharts option={o1} style={{ height: 420 }} opts={{ renderer: "canvas" }} />
        </MotionChart>
        <MotionChart title="Average battery drainage" delay={0.08}>
          <ReactECharts option={o2} style={{ height: 420 }} opts={{ renderer: "canvas" }} />
        </MotionChart>
      </div>
    </>
  );
}
