import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
      primary: { main: "#4CAF50" },   // clean green
      secondary: { main: "#ff9800" }, // warm accent
      error: { main: "#ff5252" },     // red for grid stress
      warning: { main: "#ffc107" },
      info: { main: "#2196F3" },
    },
    typography: {
        fontFamily: "Inter, sans-serif",
    },
});