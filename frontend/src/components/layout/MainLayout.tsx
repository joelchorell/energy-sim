import { Box } from "@mui/material";

export default function MainLayout({ left, right }) {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{
        width: 320,
        p: 3,
        borderRight: "1px solid #eee",
        background: "#fafafa"
      }}>
        {left}
      </Box>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        {right}
      </Box>
    </Box>
  );
}