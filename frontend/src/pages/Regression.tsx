import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import { MotionChart } from "../components/MotionChart";
import type { ScatterPack } from "../api/types";
import { lightChartMixin } from "../theme/echarts";
import { useBundle } from "../context/BundleContext";

function scatterOption(
  pack: ScatterPack,
  xName: string,
  yName: string,
  pointColor: string,
): EChartsOption {
  const m = lightChartMixin();
  const pts = pack.points.map((p) => [p.x, p.y]);
  const ln = pack.line.map((p) => [p.x, p.y]);
  return {
    ...m,
    tooltip: { trigger: "item" },
    xAxis: { ...m.xAxis, type: "value", name: xName, nameLocation: "middle", nameGap: 28, nameTextStyle: { color: "#454545" } },
    yAxis: { ...m.yAxis, type: "value", name: yName, nameTextStyle: { color: "#454545" } },
    series: [
      {
        type: "scatter",
        data: pts,
        symbolSize: 9,
        itemStyle: { color: pointColor, opacity: 0.75, borderColor: "rgba(255,255,255,0.35)", borderWidth: 0.5 },
        large: true,
        largeThreshold: 400,
      },
      {
        type: "line",
        data: ln,
        showSymbol: false,
        lineStyle: { color: "#f43f5e", width: 2.5, shadowBlur: 8, shadowColor: "rgba(244,63,94,0.45)" },
        smooth: true,
      },
    ],
  };
}

export function Regression() {
  const { scatter: s } = useBundle();

  const o1 = useMemo(
    () => scatterOption(s.dataBattery, "Data usage (MB/day)", "Battery drain (mAh/day)", "#22d3ee"),
    [s.dataBattery],
  );
  const o2 = useMemo(
    () =>
      scatterOption(
        s.appsScreen,
        "Number of apps installed",
        "Screen on time (hrs/day)",
        "#a78bfa",
      ),
    [s.appsScreen],
  );
  const o3 = useMemo(
    () => scatterOption(s.usageScreen, "App usage (min/day)", "Screen on time (hrs/day)", "#22d3ee"),
    [s.usageScreen],
  );
  const o4 = useMemo(
    () => scatterOption(s.usageBattery, "App usage (min/day)", "Battery drain (mAh/day)", "#22d3ee"),
    [s.usageBattery],
  );

  const charts: [string, EChartsOption, number][] = [
    ["Data usage vs battery", o1, 0],
    ["Apps vs screen time", o2, 0.07],
    ["App usage vs screen", o3, 0.14],
    ["App usage vs battery", o4, 0.21],
  ];

  return (
    <>
      <h2 className="page-title">Regression</h2>
      {charts.map(([title, opt, delay]) => (
        <MotionChart key={title} title={title} delay={delay}>
          <ReactECharts option={opt} style={{ height: 400 }} opts={{ renderer: "canvas" }} />
        </MotionChart>
      ))}
    </>
  );
}
