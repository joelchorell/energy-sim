import { createContext, useContext, useState } from "react";

type EnergyMix = {
  solar: number;
  wind: number;
  nuclear: number;
  hydro: number;
  gas: number;
  coal: number;
  oil: number;
};

type SimulatorContextType = {
  mix: EnergyMix;
  setMix: (m: EnergyMix) => void;
};

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const [mix, setMix] = useState<EnergyMix>({
    solar: 20,
    wind: 25,
    nuclear: 30,
    hydro: 15,
    gas: 5,
    coal: 3,
    oil: 2,
  });

  return (
    <SimulatorContext.Provider value={{ mix, setMix }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error("useSimulator must be used within SimulatorProvider");
  return ctx;
}