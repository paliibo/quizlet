import type { Accent } from "./schema";

export type AccentStyle = {
  /** Tailwind classes for a soft tinted chip. */
  chip: string;
  /** Gradient used for deck covers. */
  cover: string;
  label: string;
  /** Solid ring/border tint. */
  ring: string;
};

export const accentStyles: Record<Accent, AccentStyle> = {
  amber: {
    chip: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    cover: "from-amber-400 via-orange-500 to-rose-500",
    label: "Amber",
    ring: "ring-amber-500/40",
  },
  cyan: {
    chip: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
    cover: "from-cyan-400 via-sky-500 to-blue-600",
    label: "Cyan",
    ring: "ring-cyan-500/40",
  },
  emerald: {
    chip: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    cover: "from-emerald-400 via-teal-500 to-cyan-600",
    label: "Emerald",
    ring: "ring-emerald-500/40",
  },
  indigo: {
    chip: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
    cover: "from-indigo-400 via-violet-500 to-purple-600",
    label: "Indigo",
    ring: "ring-indigo-500/40",
  },
  rose: {
    chip: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    cover: "from-rose-400 via-pink-500 to-fuchsia-600",
    label: "Rose",
    ring: "ring-rose-500/40",
  },
  violet: {
    chip: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    cover: "from-violet-400 via-purple-500 to-indigo-600",
    label: "Violet",
    ring: "ring-violet-500/40",
  },
};

export const accentNames = Object.keys(accentStyles) as Accent[];
