import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { BundleProvider } from "./context/BundleContext";
import { Shell } from "./layout/Shell";
import { Landing } from "./pages/Landing";

const Overview = lazy(() =>
  import("./pages/Overview").then((m) => ({ default: m.Overview })),
);
const Descriptive = lazy(() =>
  import("./pages/Descriptive").then((m) => ({ default: m.Descriptive })),
);
const Boxplots = lazy(() =>
  import("./pages/Boxplots").then((m) => ({ default: m.Boxplots })),
);
const Histograms = lazy(() =>
  import("./pages/Histograms").then((m) => ({ default: m.Histograms })),
);
const Regression = lazy(() =>
  import("./pages/Regression").then((m) => ({ default: m.Regression })),
);
const BarCharts = lazy(() =>
  import("./pages/BarCharts").then((m) => ({ default: m.BarCharts })),
);
const Density = lazy(() =>
  import("./pages/Density").then((m) => ({ default: m.Density })),
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        element={
          <BundleProvider>
            <Shell />
          </BundleProvider>
        }
      >
        <Route path="/overview" element={<Overview />} />
        <Route path="/descriptive" element={<Descriptive />} />
        <Route path="/boxplots" element={<Boxplots />} />
        <Route path="/histograms" element={<Histograms />} />
        <Route path="/regression" element={<Regression />} />
        <Route path="/bars" element={<BarCharts />} />
        <Route path="/density" element={<Density />} />
      </Route>
    </Routes>
  );
}
