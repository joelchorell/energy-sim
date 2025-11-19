import { useState } from "react";
import OverviewPage from "../pages/overview/index.tsx";
import SimulatorPage from "../pages/simulator";

export default function AppRouter() {
  const [page, setPage] = useState<"overview" | "simulator">("overview");

  return page === "overview" ? (
    <OverviewPage goToSimulator={() => setPage("simulator")} />
  ) : (
    <SimulatorPage goBack={() => setPage("overview")} />
  );
}