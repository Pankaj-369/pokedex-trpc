"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { createContext, useContext, useMemo, useState } from "react";

import { TRPCReactProvider } from "@/trpc/provider";

type ThemeMode = "light" | "dark";

type ColorModeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
};

const STORAGE_KEY = "pokedex-theme-mode";

const getStoredMode = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
};

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: "light",
  toggleMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getStoredMode);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1d4ed8" },
          secondary: { main: "#e11d48" },
          background:
            mode === "light"
              ? { default: "#f4f8ff", paper: "#ffffff" }
              : { default: "#0b1220", paper: "#111a2b" },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily:
            "var(--font-geist-sans), system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
