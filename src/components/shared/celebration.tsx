"use client";

import { cn } from "@/lib/cn";
import { useSettings } from "@/store/hooks";

/**
 * The emoji-and-bounce flourish on a completed session. Honours the "calmer
 * results" preference — and, through the animation classes, the operating
 * system's reduced-motion setting.
 */
export const Celebration = ({ className, emoji }: { className?: string; emoji: string }) => {
  const { reducedConfetti } = useSettings();

  if (reducedConfetti) return null;

  return (
    <p aria-hidden className={cn("animate-pop-in text-5xl", className)}>
      {emoji}
    </p>
  );
};

/** Wrapper animation for a results panel, skipped when the learner opts out. */
export const useCelebrationClass = (): string => {
  const { reducedConfetti } = useSettings();

  return reducedConfetti ? "" : "animate-pop-in";
};
