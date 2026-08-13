"use client";

import type { Card } from "@/lib/schema";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export type FlashcardProps = {
  card: Card;
  flipped: boolean;
  onFlip: () => void;
};

/**
 * Two faces on one 3D-rotated surface. The whole card is a button so the flip
 * works from the keyboard as well as the pointer.
 */
export const Flashcard = ({ card, flipped, onFlip }: FlashcardProps) => (
  <button
    aria-label={flipped ? "Show the question" : "Show the answer"}
    className="group w-full [perspective:1600px]"
    onClick={onFlip}
    type="button"
  >
    <div
      className={cn(
        "preserve-3d relative min-h-64 w-full transition-transform duration-500 ease-out sm:min-h-72",
        flipped && "[transform:rotateY(180deg)]",
      )}
    >
      <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-raised">
        <Badge tone="muted">Question</Badge>
        <p className="font-display text-2xl font-semibold leading-snug sm:text-3xl">{card.prompt}</p>
        {card.hint ? <p className="text-sm text-muted-foreground">Hint: {card.hint}</p> : null}
        <p className="mt-2 text-xs text-muted-foreground">Click, or press Space, to flip</p>
      </div>

      <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl border border-primary/40 bg-card p-8 text-center shadow-glow [transform:rotateY(180deg)]">
        <Badge tone="primary">Answer</Badge>
        <p className="font-display text-2xl font-semibold leading-snug text-primary sm:text-3xl">
          {card.answers.join(" · ") || "No answer recorded"}
        </p>
        {card.explanation ? <p className="max-w-prose text-sm text-muted-foreground">{card.explanation}</p> : null}
      </div>
    </div>
  </button>
);
