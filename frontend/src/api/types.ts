export type RecordRow = Record<string, string | number | null>;

export interface Kpis {
  appUsageMean: string;
  screenTimeMean: string;
  batteryMean: string;
  appUsageMedian: string;
  screenTimeMedian: string;
  batteryMedian: string;
  appUsageMode: string;
  screenTimeMode: string;
  batteryMode: string;
  appUsageSd: string;
  screenTimeSd: string;
  batterySd: string;
  appUsageMin: string;
  screenTimeMin: string;
  batteryMin: string;
  appUsageMax: string;
  screenTimeMax: string;
  batteryMax: string;
  dataUsageMean: string;
  appsMean: string;
  appsMin: string;
  appsMax: string;
}

export interface BoxGroup {
  name: string;
  stats: [number, number, number, number, number];
}

export interface HistBin {
  start: number;
  end: number;
  count: number;
}

export interface HistAge {
  ageGroup: string;
  bins: HistBin[];
}

export interface ScatterPack {
  points: { x: number; y: number }[];
  line: { x: number; y: number }[];
}

export interface BarRow {
  [key: string]: string | number;
}

export interface DensitySeries {
  name: string;
  color: string;
  x: number[];
  y: number[];
}

export interface Bundle {
  records: RecordRow[];
  columns: string[];
  kpis: Kpis;
  boxBatteryOs: BoxGroup[];
  boxScreenGender: BoxGroup[];
  histScreenByAge: HistAge[];
  scatter: {
    dataBattery: ScatterPack;
    appsScreen: ScatterPack;
    usageScreen: ScatterPack;
    usageBattery: ScatterPack;
  };
  barScreenByModel: BarRow[];
  barBatteryByModel: BarRow[];
  densityScreenApps: DensitySeries[];
}
