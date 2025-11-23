import { Box, Typography } from "@mui/material";

/* -------------------------------------------
   Glow Bullet Component
--------------------------------------------*/
function GlowBulletList({ items }: { items: string[] }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, mt: 2 }}>
      {items.map((text, i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "linear-gradient(90deg, #7f5bff, #4fc3ff)",
              boxShadow:
                "0 0 10px rgba(127,91,255,0.9), 0 0 6px rgba(79,195,255,0.7)",
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontSize: 14,
              color: "rgba(240,240,255,0.9)",
              letterSpacing: "0.02em",
              lineHeight: 1.35,
            }}
          >
            {text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/* -------------------------------------------
   Intro Panel
--------------------------------------------*/
export default function IntroPanel() {
  return (
    <Box sx={{ p: 2, mt: 1 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: 700,
          letterSpacing: "0.6px",
          color: "rgba(255,255,255,0.95)",
        }}
      >
        Welcome to EnergySim
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 1,
          opacity: 0.85,
          lineHeight: 1.45,
          maxWidth: 340,
        }}
      >
        Discover how different energy mixes affect generation balance, emissions,
        grid stress and storage needs — all in real time.
      </Typography>

      <GlowBulletList
        items={[
          "Adjust energy sources and battery capacity",
          "Visualize hourly demand and supply flows",
          "See grid stress change in real time",
          "Compare countries or create your own system",
        ]}
      />

      <Typography
        variant="body2"
        sx={{
          mt: 3,
          opacity: 0.5,
          fontSize: 12,
          letterSpacing: "0.06em",
        }}
      >
        Switch to the “Simulator” tab to begin.
      </Typography>
    </Box>
  );
}