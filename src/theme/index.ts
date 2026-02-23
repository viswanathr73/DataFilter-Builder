import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f5a623", // amber accent — your brand color
    },
    background: {
      default: "#0f1117", // page background
      paper: "#181c27", // card/panel background
    },
    success: {
      main: "#2dd4a4",
    },
    error: {
      main: "#f05a5a",
    },
    text: {
      primary: "#e8ebf4",
      secondary: "#a8b0cc",
    },
  },
  typography: {
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    h6: {
      fontFamily: "'Ibarra Real Nova', Georgia, serif",
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    // Override MUI defaults globally
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiSelect: {
      defaultProps: { size: "small" },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4 },
      },
    },
  },
});

export default theme;
