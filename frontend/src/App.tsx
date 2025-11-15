import { useState } from "react";
import SimulatorPage from "./pages/simulator";
import OverviewPage from "./pages/overview";

function App() {
  const [activeTab, setActiveTab] = useState<"overview" | "simulator">("overview");

  // Persistent state: Energi-mix
  const [mix, setMix] = useState({
    solar: 20,
    wind: 20,
    nuclear: 20,
    hydro: 20,
    gas: 20,
  });

  return (
    <>
      {/* dina tabs */}
      {activeTab === "overview" && <OverviewPage />}
      {activeTab === "simulator" && (
        <SimulatorPage mix={mix} setMix={setMix} />
      )}
    </>
  );
}

export default App;