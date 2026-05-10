import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import { MotionChart } from "../components/MotionChart";
import { lightChartMixin } from "../theme/echarts";
import { useBundle } from "../context/BundleContext";

export function Boxplots() {
  const { boxBatteryOs, boxScreenGender } = useBundle();

  const optOs = useMemo<EChartsOption>(() => {
    const m = lightChartMixin();
    return {
      ...m,
      xAxis: { ...m.xAxis, type: "category", data: boxBatteryOs.map((b) => b.name), boundaryGap: true },
      yAxis: { ...m.yAxis, type: "value", name: "mAh/day", nameTextStyle: { color: "#454545" } },
      series: [
        {
          type: "boxplot",
          data: boxBatteryOs.map((b) => b.stats),
          itemStyle: {
            color: "rgba(56, 189, 248, 0.35)",
            borderColor: "#38bdf8",
            borderWidth: 1.5,
          },
        },
      ],
    };
  }, [boxBatteryOs]);

  const optGender = useMemo<EChartsOption>(() => {
    const m = lightChartMixin();
    const fill = ["rgba(56, 189, 248, 0.35)", "rgba(244, 114, 182, 0.35)"];
    const stroke = ["#38bdf8", "#f472b6"];
    return {
      ...m,
      xAxis: { ...m.xAxis, type: "category", data: boxScreenGender.map((b) => b.name), boundaryGap: true },
      yAxis: { ...m.yAxis, type: "value", name: "hrs/day", nameTextStyle: { color: "#454545" } },
      series: [
        {
          type: "boxplot",
          data: boxScreenGender.map((b, i) => ({
            value: b.stats,
            itemStyle: {
              color: fill[i % fill.length],
              borderColor: stroke[i % stroke.length],
              borderWidth: 1.5,
            },
          })),
        },
      ],
    };
  }, [boxScreenGender]);

  return (
    <>
      <h2 className="page-title">Boxplots</h2>
      <div className="grid-2">
        <MotionChart title="Battery drain by operating system" delay={0}>
          <ReactECharts option={optOs} style={{ height: 380 }} opts={{ renderer: "canvas" }} />
        </MotionChart>
        <MotionChart title="Screen usage by gender" delay={0.08}>
          <ReactECharts option={optGender} style={{ height: 380 }} opts={{ renderer: "canvas" }} />
        </MotionChart>
      </div>
    </>
  );
}
