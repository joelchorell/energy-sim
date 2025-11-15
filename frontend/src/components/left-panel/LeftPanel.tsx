import { useState } from "react";
import {
  Box,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  Divider,
} from "@mui/material";

const SOURCES = ["solar", "wind", "nuclear", "hydro", "gas", "coal", "oil"];

export default function LeftPanel() {
  const [mix, setMix] = useState<Record<string, number>>(
    Object.fromEntries(SOURCES.map((s) => [s, 0]))
  );

  const [batteryEnabled, setBatteryEnabled] = useState(false);
  const [batteryCapacity, setBatteryCapacity] = useState(1000); // MWh

  const handleMixChange = (key: string, value: number) => {
    setMix((prev) => ({ ...prev, [key]: value }));
  };

  const total = Object.values(mix).reduce((a, b) => a + b, 0);

  return (
    <Box
      sx={{
        padding: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={2}>
        Energy Mix ({total}%)
      </Typography>

      {SOURCES.map((src) => (
        <Box key={src} mb={2}>
          <Typography fontSize={14} fontWeight={500} textTransform="capitalize">
            {src}
          </Typography>
          <Slider
            value={mix[src]}
            onChange={(_, v) => handleMixChange(src, v as number)}
            step={1}
            min={0}
            max={100}
          />
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />

      <FormControlLabel
        control={
          <Switch
            checked={batteryEnabled}
            onChange={() => setBatteryEnabled((x) => !x)}
          />
        }
        label="Enable Battery Storage"
      />

      {batteryEnabled && (
        <Box mb={3}>
          <Typography fontSize={14} fontWeight={500}>
            Battery Capacity (MWh)
          </Typography>
          <Slider
            value={batteryCapacity}
            onChange={(_, v) => setBatteryCapacity(v as number)}
            step={100}
            min={0}
            max={20000}
          />
        </Box>
      )}

      <Button variant="contained" size="large">
        Simulate
      </Button>
    </Box>
  );
}