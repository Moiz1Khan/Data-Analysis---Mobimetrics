import { KpiMotion } from "../components/KpiMotion";
import { useBundle } from "../context/BundleContext";

export function Descriptive() {
  const { kpis: k } = useBundle();

  const rows: { label: string; value: string; accent: Parameters<typeof KpiMotion>[0]["accent"]; i: number }[][] =
    [
      [
        { label: "Mean app usage time", value: k.appUsageMean, accent: "purple", i: 0 },
        { label: "Mean screen on time", value: k.screenTimeMean, accent: "blue", i: 1 },
        { label: "Mean battery drain", value: k.batteryMean, accent: "red", i: 2 },
      ],
      [
        { label: "Median app usage time", value: k.appUsageMedian, accent: "blue", i: 0 },
        { label: "Median screen on time", value: k.screenTimeMedian, accent: "green", i: 1 },
        { label: "Median battery drain", value: k.batteryMedian, accent: "orange", i: 2 },
      ],
      [
        { label: "Mode app usage time", value: k.appUsageMode, accent: "green", i: 0 },
        { label: "Mode screen on time", value: k.screenTimeMode, accent: "purple", i: 1 },
        { label: "Mode battery drain", value: k.batteryMode, accent: "green", i: 2 },
      ],
      [
        { label: "SD app usage time", value: k.appUsageSd, accent: "orange", i: 0 },
        { label: "SD screen on time", value: k.screenTimeSd, accent: "orange", i: 1 },
        { label: "SD battery drain", value: k.batterySd, accent: "blue", i: 2 },
      ],
      [
        { label: "Min app usage time", value: k.appUsageMin, accent: "red", i: 0 },
        { label: "Min screen on time", value: k.screenTimeMin, accent: "red", i: 1 },
        { label: "Min battery drain", value: k.batteryMin, accent: "purple", i: 2 },
      ],
      [
        { label: "Max app usage time", value: k.appUsageMax, accent: "yellow", i: 0 },
        { label: "Max screen on time", value: k.screenTimeMax, accent: "yellow", i: 1 },
        { label: "Max battery drain", value: k.batteryMax, accent: "yellow", i: 2 },
      ],
      [
        { label: "Mean data usage", value: k.dataUsageMean, accent: "purple", i: 0 },
        { label: "Mean apps installed", value: k.appsMean, accent: "teal", i: 1 },
      ],
      [
        { label: "Min apps installed", value: k.appsMin, accent: "blue", i: 0 },
        { label: "Max apps installed", value: k.appsMax, accent: "green", i: 1 },
      ],
    ];

  return (
    <>
      <h2 className="page-title">Descriptive statistics</h2>
      {rows.map((cells, ri) => (
        <div key={ri} className="kpi-grid">
          {cells.map((c) => (
            <KpiMotion key={c.label} label={c.label} value={c.value} accent={c.accent} i={c.i} />
          ))}
        </div>
      ))}
    </>
  );
}
