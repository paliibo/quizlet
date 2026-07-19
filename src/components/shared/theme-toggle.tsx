"use client";

import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/cn";
import { useMounted } from "@/store/hooks";

import { type ThemePreference, useTheme } from "./theme-provider";

const options: Array<{ icon: typeof SunIcon; label: string; value: ThemePreference }> = [
  { icon: SunIcon, label: "Light", value: "light" },
  { icon: DesktopIcon, label: "System", value: "system" },
  { icon: MoonIcon, label: "Dark", value: "dark" },
];

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const mounted = useMounted();

  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5">
      {options.map(({ icon: Icon, label, value }) => (
        <button
          aria-label={`${label} theme`}
          aria-pressed={mounted && theme === value}
          className={cn(
            "rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground",
            mounted && theme === value && "bg-muted text-foreground",
          )}
          key={value}
          onClick={() => setTheme(value)}
          title={`${label} theme`}
          type="button"
        >
          <Icon />
        </button>
      ))}
    </div>
  );
};
