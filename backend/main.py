"""API for mobile usage analytics — serves one JSON bundle for the React SPA."""
import json
from pathlib import Path

import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scipy.stats import gaussian_kde

CSV_PATH = Path(__file__).resolve().parent.parent / "mobileusage.csv"

C_APP = "App Usage Time (min/day)"
C_SCR = "Screen On Time (hours/day)"
C_BAT = "Battery Drain (mAh/day)"
C_DATA = "Data Usage (MB/day)"
C_APPS = "Number of Apps Installed"
C_OS = "Operating System"
C_GENDER = "Gender"
C_MODEL = "Device Model"
C_AGE = "Age"


def load_df() -> pd.DataFrame:
    data = pd.read_csv(CSV_PATH)
    if "AgeGroup" not in data.columns:
        data["AgeGroup"] = pd.cut(
            data[C_AGE],
            bins=[18, 25, 35, 45, 55, 100],
            labels=["18-25", "26-35", "36-45", "46-55", "55+"],
            right=True,
        )
    data["AgeGroup"] = data["AgeGroup"].astype(str)
    return data


def get_mode(v: pd.Series):
    s = v.dropna()
    if s.empty:
        return None
    uniqv = s.unique()
    tab = [int(np.sum(s == u)) for u in uniqv]
    return uniqv[int(np.argmax(tab))]


def _five_num(s: pd.Series) -> list[float]:
    s = s.dropna()
    if s.empty:
        return [0.0, 0.0, 0.0, 0.0, 0.0]
    return [
        float(s.min()),
        float(s.quantile(0.25)),
        float(s.median()),
        float(s.quantile(0.75)),
        float(s.max()),
    ]


def _linreg(x: np.ndarray, y: np.ndarray) -> tuple[float, float]:
    mask = np.isfinite(x) & np.isfinite(y)
    x, y = x[mask], y[mask]
    if len(x) < 2:
        return 0.0, 0.0
    coef = np.polyfit(x, y, 1)
    return float(coef[0]), float(coef[1])


def _kde_xy(values: np.ndarray, n: int = 280) -> tuple[list[float], list[float]]:
    v = values[np.isfinite(values)]
    if v.size < 2:
        return [], []
    kde = gaussian_kde(v)
    lo, hi = float(v.min()), float(v.max())
    pad = (hi - lo) * 0.06 + 0.02
    xs = np.linspace(lo - pad, hi + pad, n)
    ys = kde(xs)
    return xs.tolist(), ys.tolist()


def build_bundle() -> dict:
    df = load_df()

    d = df
    kpis = {
        "appUsageMean": f"{round(d[C_APP].mean(), 1)} min",
        "screenTimeMean": f"{round(d[C_SCR].mean(), 1)} hrs",
        "batteryMean": f"{round(d[C_BAT].mean(), 0)} mAh",
        "appUsageMedian": f"{round(d[C_APP].median(), 1)} min",
        "screenTimeMedian": f"{round(d[C_SCR].median(), 1)} hrs",
        "batteryMedian": f"{round(d[C_BAT].median(), 0)} mAh",
        "appUsageMode": str(get_mode(d[C_APP])),
        "screenTimeMode": str(get_mode(d[C_SCR])),
        "batteryMode": str(get_mode(d[C_BAT])),
        "appUsageSd": f"{round(d[C_APP].std(), 1)} min",
        "screenTimeSd": f"{round(d[C_SCR].std(), 1)} hrs",
        "batterySd": f"{round(d[C_BAT].std(), 0)} mAh",
        "appUsageMin": f"{d[C_APP].min()} min",
        "screenTimeMin": f"{d[C_SCR].min()} hrs",
        "batteryMin": f"{d[C_BAT].min()} mAh",
        "appUsageMax": f"{d[C_APP].max()} min",
        "screenTimeMax": f"{d[C_SCR].max()} hrs",
        "batteryMax": f"{d[C_BAT].max()} mAh",
        "dataUsageMean": f"{round(d[C_DATA].mean(), 1)} MB",
        "appsMean": f"{round(d[C_APPS].mean(), 1)}",
        "appsMin": str(int(d[C_APPS].min())),
        "appsMax": str(int(d[C_APPS].max())),
    }

    box_battery_os = []
    for os_name in sorted(df[C_OS].dropna().unique()):
        box_battery_os.append(
            {"name": str(os_name), "stats": _five_num(df.loc[df[C_OS] == os_name, C_BAT])}
        )

    box_screen_gender = []
    for g in sorted(df[C_GENDER].dropna().unique()):
        box_screen_gender.append(
            {"name": str(g), "stats": _five_num(df.loc[df[C_GENDER] == g, C_SCR])}
        )

    hist_by_age = []
    for ag in ["18-25", "26-35", "36-45", "46-55", "55+"]:
        sub = df.loc[df["AgeGroup"] == ag, C_SCR].dropna()
        if sub.empty:
            hist_by_age.append({"ageGroup": ag, "bins": []})
            continue
        counts, edges = np.histogram(sub, bins=np.arange(sub.min(), sub.max() + 0.5, 0.5))
        bins = []
        for i in range(len(counts)):
            bins.append(
                {"start": float(edges[i]), "end": float(edges[i + 1]), "count": int(counts[i])}
            )
        hist_by_age.append({"ageGroup": ag, "bins": bins})

    x1 = df[C_DATA].to_numpy(dtype=float)
    y1 = df[C_BAT].to_numpy(dtype=float)
    m1, b1 = _linreg(x1, y1)
    x1r = np.linspace(np.nanmin(x1), np.nanmax(x1), 2)

    x2 = df[C_APPS].to_numpy(dtype=float)
    y2 = df[C_SCR].to_numpy(dtype=float)
    m2, b2 = _linreg(x2, y2)
    x2r = np.linspace(np.nanmin(x2), np.nanmax(x2), 2)

    x3 = df[C_APP].to_numpy(dtype=float)
    y3 = df[C_SCR].to_numpy(dtype=float)
    m3, b3 = _linreg(x3, y3)
    x3r = np.linspace(np.nanmin(x3), np.nanmax(x3), 2)

    x4 = df[C_APP].to_numpy(dtype=float)
    y4 = df[C_BAT].to_numpy(dtype=float)
    m4, b4 = _linreg(x4, y4)
    x4r = np.linspace(np.nanmin(x4), np.nanmax(x4), 2)

    scatter = {
        "dataBattery": {
            "points": df[[C_DATA, C_BAT]].rename(columns={C_DATA: "x", C_BAT: "y"})
            .dropna()
            .to_dict(orient="records"),
            "line": [{"x": float(x1r[0]), "y": float(m1 * x1r[0] + b1)}, {"x": float(x1r[1]), "y": float(m1 * x1r[1] + b1)}],
        },
        "appsScreen": {
            "points": df[[C_APPS, C_SCR]].rename(columns={C_APPS: "x", C_SCR: "y"})
            .dropna()
            .to_dict(orient="records"),
            "line": [{"x": float(x2r[0]), "y": float(m2 * x2r[0] + b2)}, {"x": float(x2r[1]), "y": float(m2 * x2r[1] + b2)}],
        },
        "usageScreen": {
            "points": df[[C_APP, C_SCR]].rename(columns={C_APP: "x", C_SCR: "y"})
            .dropna()
            .to_dict(orient="records"),
            "line": [{"x": float(x3r[0]), "y": float(m3 * x3r[0] + b3)}, {"x": float(x3r[1]), "y": float(m3 * x3r[1] + b3)}],
        },
        "usageBattery": {
            "points": df[[C_APP, C_BAT]].rename(columns={C_APP: "x", C_BAT: "y"})
            .dropna()
            .to_dict(orient="records"),
            "line": [{"x": float(x4r[0]), "y": float(m4 * x4r[0] + b4)}, {"x": float(x4r[1]), "y": float(m4 * x4r[1] + b4)}],
        },
    }

    avg_scr = (
        df.groupby(C_MODEL, as_index=False)[C_SCR].mean().rename(columns={C_SCR: "value"})
    )
    bar_screen = avg_scr.to_dict(orient="records")

    avg_bat = (
        df.groupby(C_MODEL, as_index=False)[C_BAT].mean().rename(columns={C_BAT: "value"})
    )
    bar_battery = avg_bat.to_dict(orient="records")

    q3 = df[C_APPS].quantile(0.75)
    df_q = df.assign(
        _apps_cat=np.where(df[C_APPS] > q3, "> Q3", "≤ Q3"),
    )
    density_series = []
    for cat, color in [("≤ Q3", "#38bdf8"), ("> Q3", "#fb923c")]:
        vals = df_q.loc[df_q["_apps_cat"] == cat, C_SCR].to_numpy(dtype=float)
        xs, ys = _kde_xy(vals)
        density_series.append({"name": cat, "color": color, "x": xs, "y": ys})

    records = json.loads(df.to_json(orient="records"))

    return {
        "records": records,
        "columns": list(df.columns),
        "kpis": kpis,
        "boxBatteryOs": box_battery_os,
        "boxScreenGender": box_screen_gender,
        "histScreenByAge": hist_by_age,
        "scatter": scatter,
        "barScreenByModel": bar_screen,
        "barBatteryByModel": bar_battery,
        "densityScreenApps": density_series,
    }


app = FastAPI(title="Mobimetrics API", description="Analytics bundle for the Mobimetrics dashboard.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_bundle_cache: dict | None = None


@app.get("/api/bundle")
def get_bundle():
    global _bundle_cache
    if _bundle_cache is None:
        _bundle_cache = build_bundle()
    return _bundle_cache


@app.get("/api/health")
def health():
    return {"ok": True}
