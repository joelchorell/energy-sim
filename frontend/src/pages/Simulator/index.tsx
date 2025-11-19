import MainLayout from "../../components/layout/MainLayout";
import TabsWrapper from "../../components/layout/TabsWrapper";
import IntroPanel from "../../components/intro/IntroPanel";
import EnergyMixPanel from "../../pages/simulator/EnergyMixPanel";
import { useSimulator } from "../../context/SimulatorContext";
import { Button, Box } from "@mui/material";

export default function SimulatorPage({ goBack }: { goBack?: () => void }) {
  const { setMix } = useSimulator();

  return (
    <MainLayout
      left={
        <TabsWrapper
          intro={<IntroPanel />}
          simulator={
            <EnergyMixPanel
              onSimulate={(m) => {
                // persist selected mix to global context and trigger any side effects
                setMix && setMix(m);
                console.log("simulate:", m);
              }}
            />
          }
        />
      }
      right={
        <Box>
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" onClick={() => goBack && goBack()}>
              Back
            </Button>
          </Box>

          <div>Graphs + Grid Stress here</div>
        </Box>
      }
    />
  );
}