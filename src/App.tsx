import { UserProvider } from "./contexts/UserContext";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import theme from "./app/theme";

export default function App({ Component, pageProps }: any) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
} 