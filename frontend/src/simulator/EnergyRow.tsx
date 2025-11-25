import { useEffect, useState, KeyboardEvent, useRef } from "react";
import { Box, Slider, TextField, Typography } from "@mui/material";

interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
}

export default function EnergyRow({ label, value, onChange }: Props) {
  const [input, setInput] = useState<string>(value.toString());

  // Ref för textfältet så vi kan blura det
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync external value → input
  useEffect(() => {
    setInput(value.toString());
  }, [value]);

  const commitValue = () => {
    const trimmed = input.trim();

    if (trimmed === "") {
      setInput(value.toString());
      return;
    }

    const num = Number(trimmed);
    if (Number.isNaN(num)) {
      setInput(value.toString());
      return;
    }

    const clamped = Math.min(100, Math.max(0, num));
    onChange(clamped);
    setInput(clamped.toString());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // 👇 Force blur för att stänga fältet
      inputRef.current?.blur();

      // 👇 Commit direkt efter blur
      commitValue();
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Label */}
        <Typography sx={{ width: 80 }}>{label}</Typography>

        {/* Slider */}
        <Slider
          value={value}
          onChange={(_, v) => onChange(v as number)}
          min={0}
          max={100}
          sx={{ flex: 1 }}
        />

        {/* Input */}
        <TextField
          inputRef={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={commitValue}
          onKeyDown={handleKeyDown}
          inputProps={{
            style: {
              textAlign: "center",
              padding: "4px",
            },
          }}
          sx={{ width: 64 }}
        />
      </Box>
    </Box>
  );
}