import type { Accent } from "@/lib/schema";

import { accentStyles } from "@/lib/accents";
import { cn } from "@/lib/cn";

export type DeckCoverProps = {
  accent: Accent;
  className?: string;
  emoji: string;
  size?: "lg" | "md" | "sm";
};

const sizes = {
  lg: "h-24 w-24 text-4xl rounded-2xl",
  md: "h-14 w-14 text-2xl rounded-xl",
  sm: "h-10 w-10 text-lg rounded-lg",
} as const;

/** Gradient tile carrying the deck's emoji — the strongest visual id a deck has. */
export const DeckCover = ({ accent, className, emoji, size = "md" }: DeckCoverProps) => (
  <span
    aria-hidden
    className={cn(
      "grid shrink-0 place-items-center bg-gradient-to-br shadow-raised",
      accentStyles[accent].cover,
      sizes[size],
      className,
    )}
  >
    <span className="drop-shadow-sm">{emoji}</span>
  </span>
);
