import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

export default function IntroPanel() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Welcome to EnergySim
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        EnergySim lets you explore how different energy mixes influence
        electricity production, demand balancing, grid stability and CO₂ emissions.
      </Typography>

      <List dense disablePadding>
        {[
          "Adjust energy sources and battery capacity",
          "Visualize hourly demand and supply",
          "See grid stress change in real time",
          "Compare countries or build your own system",
        ].map((item, i) => (
          <ListItem key={i} disableGutters sx={{ py: 0.2 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <CircleIcon sx={{ fontSize: 8, color: "primary.main" }} />
            </ListItemIcon>
            <ListItemText
              primary={item}
              primaryTypographyProps={{
                fontSize: 14,
                color: "rgba(240,240,255,0.9)",
              }}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="body2" sx={{ mt: 3, opacity: 0.7 }}>
        Switch to the “Simulator” tab to begin.
      </Typography>
    </Box>
  );
}