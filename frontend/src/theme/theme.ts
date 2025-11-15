import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0E1117",
      paper: "#11141C",
    },
    primary: {
      main: "#4E8CFF", // snygg kall blå accent
    },
    secondary: {
      main: "#8759FF",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#9BA1B7",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    body1: { fontSize: "0.95rem" },
  },
  shape: {
    borderRadius: 12,
  }
});

export default theme;