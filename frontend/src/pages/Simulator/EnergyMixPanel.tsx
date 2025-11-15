import { Box, Typography, Slider, Button, Stack } from "@mui/material";
import { useState, useMemo } from "react";

type EnergyMix = {
  solar: number;
  wind: number;
  nuclear: number;
  hydro: number;
  gas: number;
  coal: number;
  oil: number;
};

export default function EnergyMixPanel({ onSimulate }: { onSimulate: (mix: EnergyMix) => void }) {
  const [mix, setMix] = useState<EnergyMix>({
    solar: 20,
    wind: 20,
    nuclear: 20,
    hydro: 20,
    gas: 10,
    coal: 5,
    oil: 5,
  });

  const total = useMemo(() => {
    return Object.values(mix).reduce((sum, v) => sum + v, 0);
  }, [mix]);

  const isValid = total === 100;

  const handleChange = (key: keyof EnergyMix, value: number) => {
    setMix((prev) => ({ ...prev, [key]: value }));
  };

  const energySources: { key: keyof EnergyMix; label: string }[] = [
    { key: "solar", label: "Solar" },
    { key: "wind", label: "Wind" },
    { key: "nuclear", label: "Nuclear" },
    { key: "hydro", label: "Hydro" },
    { key: "gas", label: "Gas" },
    { key: "coal", label: "Coal" },
    { key: "oil", label: "Oil" },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Energy Mix
      </Typography>

      <Stack spacing={3}>
        {energySources.map(({ key, label }) => (
          <Box key={key}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>{label}</Typography>
              <Typography>{mix[key]}%</Typography>
            </Box>

            <Slider
              value={mix[key]}
              onChange={(_, v) => handleChange(key, v as number)}
              min={0}
              max={100}
              step={1}
            />
          </Box>
        ))}

        {/* TOTAL METER */}
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 1,
            bgcolor: isValid ? "rgba(0,180,0,0.08)" : "rgba(255,0,0,0.08)",
            border: `1px solid ${isValid ? "#2ecc71" : "#e74c3c"}`,
            textAlign: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: isValid ? "#2ecc71" : "#e74c3c",
            }}
          >
            Total: {total}%
          </Typography>
          {!isValid && (
            <Typography variant="caption" sx={{ color: "#e74c3c" }}>
              Total must be exactly 100%
            </Typography>
          )}
        </Box>

        {/* SIMULATE BUTTON */}
        <Button
          variant="contained"
          disabled={!isValid}
          onClick={() => onSimulate(mix)}
          sx={{
            mt: 1,
            py: 1.2,
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          Simulate
        </Button>
      </Stack>
    </Box>
  );
}