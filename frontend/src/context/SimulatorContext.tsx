import React, { createContext, useContext, useState } from "react";

export interface SimulationResult {
  region: string;
  total_surplus_twh: number;
  total_unmet_twh: number;
  total_emissions_tonnes: number;
  avg_emission_intensity: number;
  hours_unmet: number;
  max_unmet_mw: number;
  max_surplus_mw: number;
  hourly_data: {
    demand_mw: number[];
    total_generation_mw: number[];
    battery_soc: number[];
  };
}

interface SimulatorContextType {
  mix: Record<string, number>;
  setMix: (m: Record<string, number>) => void;

  result: SimulationResult | null;
  setResult: (r: SimulationResult | null) => void;
}

const SimulatorContext = createContext<SimulatorContextType>({
  mix: {},
  setMix: () => {},
  result: null,
  setResult: () => {},
});

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const [mix, setMix] = useState<Record<string, number>>({});
  const [result, setResult] = useState<SimulationResult | null>(null);

  return (
    <SimulatorContext.Provider value={{ mix, setMix, result, setResult }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  return useContext(SimulatorContext);
}