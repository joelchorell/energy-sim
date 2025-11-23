import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import TabsWrapper from "../../components/layout/TabsWrapper";
import IntroPanel from "../../components/intro/IntroPanel";
import EnergyMixPanel from "../../pages/simulator/EnergyMixPanel";
import { useSimulator } from "../../context/SimulatorContext";
import { Box } from "@mui/material";
import {  motion } from "framer-motion";
import OverviewOverlay from "../../components/overview/OverviewOverlay";
// ❗ OBS – du måste ha en komponent för simulatorn här:
const SimulatorRightPanel = () => (
  <Box sx={{ height: "100%", width: "100%", p: 2 }}>
    <div>Graphs + Grid Stress here</div>
  </Box>
);

export default function SimulatorPage() {
  const { setMix } = useSimulator();
  const [tab, setTab] = useState(0);

const rightPanel = (
  <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
    {/* Simulator always mounted */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
      }}
    >
      <SimulatorRightPanel />
    </Box>

    {/* Overview overlay (always mounted, just fades) */}
    <motion.div
      key="overlay"
      initial={false}
      animate={{ opacity: tab === 0 ? 1 : 0 }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: tab === 0 ? "auto" : "none", // Important
        zIndex: 2,
      }}
    >
      <OverviewOverlay />
    </motion.div>
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
                  setMix(m);
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