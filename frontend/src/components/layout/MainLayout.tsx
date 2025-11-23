import { Box } from "@mui/material";

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function MainLayout({ left, right }: Props) {
  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* LEFT PANEL */}
      <Box
        sx={{
          width: 360,
          flexShrink: 0,
          bgcolor: "background.paper",
          borderRight: "1px solid rgba(255,255,255,0.1)",
          p: 3,
          overflowY: "auto",
        }}
      >
        {left}
      </Box>

      {/* RIGHT PANEL */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          bgcolor: "background.default",
          overflow: "hidden",   // IMPORTANT
        }}
      >
        {/* Scrollable content wrapper */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            overflowY: "hidden",
            p: 0,
          }}
        >
          {right}
        </Box>
      </Box>
    </Box>
  );
}