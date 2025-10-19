"use client";

import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { esES } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import "dayjs/locale/es";
import theme from "./theme";
import { UserProvider } from "@/contexts/UserContext";
import "./datepicker-styles.css";

// Configure dayjs to use Spanish locale
dayjs.locale("es");

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <LocalizationProvider 
        dateAdapter={AdapterDayjs}
        adapterLocale="es"
        localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </LocalizationProvider>
    </UserProvider>
  );
} 