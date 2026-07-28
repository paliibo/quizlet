"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemePreference = "dark" | "light" | "system";

export const THEME_STORAGE_KEY = "quizbrain:theme";

type ThemeContextValue = {
  resolved: "dark" | "light";
  setTheme: (theme: ThemePreference) => void;
  theme: ThemePreference;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

const apply = (theme: ThemePreference): "dark" | "light" => {
  const resolved = theme === "system" ? (prefersDark() ? "dark" : "light") : theme;

  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;

  return resolved;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemePreference>("system");
  const [resolved, setResolved] = useState<"dark" | "light">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
    const initial = stored ?? "system";

    setThemeState(initial);
    setResolved(apply(initial));
  }, []);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(apply("system"));

    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    setThemeState(next);
    setResolved(apply(next));
  }, []);

  const value = useMemo(() => ({ resolved, setTheme, theme }), [resolved, setTheme, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");

  return context;
};

/**
 * Inlined before paint so the correct theme class is on <html> for the first
 * frame. Without it every reload flashes light before hydration catches up.
 */
export const themeScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var t=localStorage.getItem(k)||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
