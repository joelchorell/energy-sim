import { useMemo, useState } from "react";
import { Box, Typography, Slider, Button, Stack, Switch, TextField } from "@mui/material";
import { useSimulator } from "../context/SimulatorContext";


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
  const { mix, setMix } = useSimulator();
  const [enabled, setEnabled] = useState<Record<keyof EnergyMix, boolean>>({
    solar: mix.solar > 0,
    wind: mix.wind > 0,
    nuclear: mix.nuclear > 0,
    hydro: mix.hydro > 0,
    gas: mix.gas > 0,
    coal: mix.coal > 0,
    oil: mix.oil > 0,
  });
  const [prevValue, setPrevValue] = useState<Record<keyof EnergyMix, number>>({
    solar: mix.solar || 20,
    wind: mix.wind || 20,
    nuclear: mix.nuclear || 20,
    hydro: mix.hydro || 20,
    gas: mix.gas || 10,
    coal: mix.coal || 5,
    oil: mix.oil || 5,
  });

  const total = useMemo(() => {
    return Object.values(mix).reduce((sum, v) => sum + v, 0);
  }, [mix]);
  const isValid = total === 100;
  const handleChange = (key: keyof EnergyMix, value: number) => {
    setMix({ ...mix, [key]: value });
    if (value > 0) {
      setEnabled((e) => ({ ...e, [key]: true }));
      setPrevValue((p) => ({ ...p, [key]: value }));
    }
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
  const meterBg = total === 100 ? "rgba(0,180,0,0.08)" : total < 100 ? "rgba(52,152,219,0.06)" : "rgba(255,0,0,0.08)";
  const meterBorder = total === 100 ? "#2ecc71" : total < 100 ? "#3498db" : "#e74c3c";
  const meterColor = total === 100 ? "#2ecc71" : total < 100 ? "#3498db" : "#e74c3c";
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Energy Mix
      </Typography>
      <Stack spacing={3}>
        {energySources.map(({ key, label }) => (
          <Box
            key={key}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 1,
              bgcolor: "background.paper",
              border: "1px solid rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                <Typography sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</Typography>
                <Switch
                  size="small"
                  checked={enabled[key]}
                  onChange={() => {
                    const isOn = enabled[key];
                    if (isOn) {
                      setPrevValue((p) => ({ ...p, [key]: mix[key] }));
                      setEnabled((e) => ({ ...e, [key]: false }));
                      setMix({ ...mix, [key]: 0 });
                    } else {
                      const restored = prevValue[key] ?? 10;
                      setEnabled((e) => ({ ...e, [key]: true }));
                      setMix({ ...mix, [key]: restored });
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <TextField
                  size="small"
                  type="number"
                  value={mix[key]}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (Number.isNaN(v)) return;
                    const clamped = Math.max(0, Math.min(100, Math.round(v)));
                    handleChange(key, clamped);
                  }}
                  inputProps={{ min: 0, max: 100, step: 1 }}
                  sx={{
                    width: 52.8,
                    '& .MuiInputBase-input': { textAlign: 'right', paddingRight: 0 },
                  }}
                  disabled={!enabled[key]}
                />
                <Typography sx={{ fontWeight: 600 }}>{"%"}</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 1 }}>
              <Slider
                value={mix[key]}
                onChange={(_, v) => handleChange(key, v as number)}
                min={0}
                max={100}
                step={1}
                disabled={!enabled[key]}
                sx={{ width: "100%" }}
              />
            </Box>
          </Box>
        ))}
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 1,
            bgcolor: meterBg,
            border: `1px solid ${meterBorder}`,
            textAlign: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: meterColor,
            }}
          >
            Total: {total}%
          </Typography>
          {total !== 100 && (
            <Typography variant="caption" sx={{ color: meterColor }}>
              Total must be exactly 100%
            </Typography>
          )}
        </Box>
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