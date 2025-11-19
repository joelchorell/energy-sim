import MainLayout from "../../components/layout/MainLayout";
import IntroPanel from "../../components/intro/IntroPanel";
import { Box, Typography, Button } from "@mui/material";

export default function OverviewPage({ goToSimulator }: { goToSimulator: () => void }) {
  return (
    <MainLayout
      left={<IntroPanel />}
      right={
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Overview
          </Typography>

          <Typography sx={{ mb: 3 }}>
            This overview will show high-level metrics, recent simulations, and
            quick actions. Use the button below to jump into the simulator.
          </Typography>

          <Button variant="contained" onClick={goToSimulator}>
            Open Simulator
          </Button>
        </Box>
      }
    />
  );
}
