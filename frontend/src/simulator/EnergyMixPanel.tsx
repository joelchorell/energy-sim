import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useSimulator } from "../context/SimulatorContext";
import EnergyRow from "./EnergyRow";

export default function EnergyMixPanel({
  onSimulate,
}: {
  onSimulate?: (mix: Record<string, number>) => void;
}) {
  const { setMix, setResult } = useSimulator();

  // All sliders
  const [solar, setSolar] = useState(20);
  const [wind, setWind] = useState(20);
  const [nuclear, setNuclear] = useState(20);
  const [hydro, setHydro] = useState(20);
  const [gas, setGas] = useState(20);
  const [coal, setCoal] = useState(0);
  const [oil, setOil] = useState(0);

  const total =
    solar + wind + nuclear + hydro + gas + coal + oil;

  const handleSimulate = async () => {
    const mix = { solar, wind, nuclear, hydro, gas, coal, oil };

    try {
      const res = await axios.post("http://127.0.0.1:8000/simulate", {
        ...mix,
        region: "northern_europe",
        verbose: false,
      });

      setMix(mix);
      setResult(res.data.result);

      onSimulate && onSimulate(mix);
    } catch (err) {
      console.error("Simulation failed:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Energy Mix (%)
      </Typography>

      {/* Energy input rows */}
      <EnergyRow label="Solar" value={solar} onChange={setSolar} />
      <EnergyRow label="Wind" value={wind} onChange={setWind} />
      <EnergyRow label="Nuclear" value={nuclear} onChange={setNuclear} />
      <EnergyRow label="Hydro" value={hydro} onChange={setHydro} />
      <EnergyRow label="Gas" value={gas} onChange={setGas} />
      <EnergyRow label="Coal" value={coal} onChange={setCoal} />
      <EnergyRow label="Oil" value={oil} onChange={setOil} />

      {/* TOTAL */}
      <Typography
        sx={{
          mt: 2,
          mb: 2,
          fontWeight: 700,
          fontSize: 16,
          color: total === 100 ? "#90ee90" : "#ffb04d",
        }}
      >
        Total: {total}%
      </Typography>

      {/* Button */}
      <Button
        variant="contained"
        fullWidth
        disabled={total !== 100}
        onClick={handleSimulate}
        sx={{ mt: 1 }}
      >
        Simulate
      </Button>
    </Box>
  );
}