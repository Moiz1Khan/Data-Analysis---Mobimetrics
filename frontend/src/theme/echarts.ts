/** ECharts theme — light surface, black typography, smooth animations */
export const chartAnimation = {
  animation: true,
  animationDuration: 900,
  animationDurationUpdate: 650,
  animationEasing: "cubicOut" as const,
  animationEasingUpdate: "cubicInOut" as const,
};

export const baseTextStyle = {
  color: "#1a1a1a",
  fontFamily: "'DM Sans', system-ui, sans-serif",
  fontSize: 11,
};

/** Light chart chrome for ash / off-white dashboard */
export function lightChartMixin() {
  return {
    ...chartAnimation,
    textStyle: baseTextStyle,
    backgroundColor: "transparent",
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      top: "14%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "rgba(255, 255, 255, 0.96)",
      borderColor: "rgba(0, 0, 0, 0.12)",
      textStyle: { color: "#111", fontSize: 12 },
    },
    xAxis: {
      axisLine: { lineStyle: { color: "rgba(0, 0, 0, 0.35)" } },
      splitLine: { lineStyle: { color: "rgba(0, 0, 0, 0.06)" } },
      axisLabel: { color: "#3d3d3d" },
    },
    yAxis: {
      axisLine: { lineStyle: { color: "rgba(0, 0, 0, 0.35)" } },
      splitLine: { lineStyle: { color: "rgba(0, 0, 0, 0.06)" } },
      axisLabel: { color: "#3d3d3d" },
    },
  };
}
