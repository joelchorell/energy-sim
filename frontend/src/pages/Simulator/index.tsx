
import React, { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import TabsWrapper from "../../components/layout/TabsWrapper";
import IntroPanel from "../../components/intro/IntroPanel";
import EnergyMixPanel from "../../pages/simulator/EnergyMixPanel";
import { useSimulator } from "../../context/SimulatorContext";
import { Box } from "@mui/material";
import OverviewOverlay from "../../components/overview/OverviewOverlay.tsx"

export default function SimulatorPage() {
  const { setMix } = useSimulator();
  const [tab, setTab] = useState(0);

  // Right panel layouts
const rightPanel = tab === 0 ? (
  <OverviewOverlay />
) : (
  <Box>
    {/* Simulator layout */}
    <div>Graphs + Grid Stress here</div>
  </Box>
);

  return (
    <MainLayout
      left={
        <Box sx={{ height: "100%" }}>
          <TabsWrapper
            intro={<IntroPanel />}
            simulator={
              <EnergyMixPanel
                onSimulate={(m) => {
                  setMix && setMix(m);
                  console.log("simulate:", m);
                }}
              />
            }
            tab={tab}
            setTab={setTab}
          />
        </Box>
      }
      right={rightPanel}
    />
  );
}