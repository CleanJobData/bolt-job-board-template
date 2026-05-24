import * as React from "react";
import { THEME_STORAGE_KEY, type ThemeMode } from "./storage";

type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggleResolved: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") return getSystemTheme();
  return mode;
}

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // ignore
  }
  return "system";
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<ThemeMode>(readStoredMode);
  const [resolved, setResolved] = React.useState<ResolvedTheme>(() =>
    resolveTheme(readStoredMode())
  );

  const setMode = React.useCallback((newMode: ThemeMode) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch {
      // ignore
    }
    setModeState(newMode);
    const newResolved = resolveTheme(newMode);
    setResolved(newResolved);
    applyTheme(newResolved);
  }, []);

  const toggleResolved = React.useCallback(() => {
    setMode(resolved === "dark" ? "light" : "dark");
  }, [resolved, setMode]);

  React.useLayoutEffect(() => {
    const newResolved = resolveTheme(mode);
    setResolved(newResolved);
    applyTheme(newResolved);
  }, [mode]);

  React.useEffect(() => {
    if (mode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const newResolved = getSystemTheme();
      setResolved(newResolved);
      applyTheme(newResolved);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode]);

  const value = React.useMemo(
    () => ({ mode, resolved, setMode, toggleResolved }),
    [mode, resolved, setMode, toggleResolved]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
