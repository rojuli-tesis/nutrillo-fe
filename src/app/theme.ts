"use client";

import { createTheme } from "@mui/material/styles";
import { Lato } from "next/font/google";

const lato = Lato({ subsets: ["latin-ext"], weight: ["400", "700"] });

const theme = createTheme({
  typography: {
    fontFamily: lato.style.fontFamily,
  },
  palette: {
    primary: {
      main: "#45BBA4",
      contrastText: "#fff",
    },
    secondary: {
      main: "#A445BB",
      light: "#f1d4f9",
    },
    error: {
      main: "#BB455C",
    },
    success: {
      main: "#97BB45",
      light: "#dfeeab",
    },
    info: {
      main: "#6945BB",
    },
    background: {
      default: "#fff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        // root: {
        //   textTransform: "none",
        //   letterSpacing: "2px",
        // },
      },
    },
  },
});

export default theme;
