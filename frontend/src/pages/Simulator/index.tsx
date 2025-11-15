import MainLayout from "../../components/layout/MainLayout";
import TabsWrapper from "../../components/layout/TabsWrapper";
import IntroPanel from "../../components/intro/IntroPanel";
import EnergyMixPanel from "../../pages/simulator/EnergyMixPanel";

export default function SimulatorPage() {
  return (
    <MainLayout
      left={
        <TabsWrapper
          intro={<IntroPanel />}
          simulator={<EnergyMixPanel onSimulate={(m) => console.log("simulate:", m)} />}
        />
      }
      right={<div>Graphs + Grid Stress here</div>}
    />
  );
}