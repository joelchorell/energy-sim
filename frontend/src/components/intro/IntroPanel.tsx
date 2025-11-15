import { Box, Typography } from "@mui/material";

export default function IntroPanel() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Welcome to EnergySim ⚡
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        EnergySim lets you explore how different energy mixes influence
        electricity production, demand balancing, grid stability,
        CO₂ emissions and storage needs.
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        • Adjust energy sources and battery capacity  
        • Visualize hourly demand and supply  
        • See grid stress change in real time  
        • Compare countries or build your own system  
      </Typography>

      <Typography variant="body2" sx={{ mt: 3, opacity: 0.7 }}>
        Switch to the “Simulator” tab to begin.
      </Typography>
    </Box>
  );
}