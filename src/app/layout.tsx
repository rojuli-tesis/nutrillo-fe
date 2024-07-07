import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const inter = Lato({ subsets: ["latin-ext"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Nutrillo",
  description: "Tu nutricionista de bolsillo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{
          margin: 0,
        }}
      >
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
