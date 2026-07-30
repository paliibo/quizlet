"use client";

import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/card";
import type { Card } from "@/lib/schema";

const typeLabels: Record<Card["type"], string> = {
  multi: "Multi select",
  single: "Single choice",
  text: "Written",
};

export const CardPreviewList = ({ cards }: { cards: Card[] }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Cards</h2>
        <Button onClick={() => setRevealed(current => !current)} size="sm" variant="ghost">
          {revealed ? <EyeClosedIcon /> : <EyeOpenIcon />}
          {revealed ? "Hide answers" : "Reveal answers"}
        </Button>
      </div>

      <ol className="flex flex-col gap-2">
        {cards.map((card, index) => (
          <Surface className="flex items-start gap-3 p-4" key={card.id}>
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-muted text-xs font-semibold tabular-nums text-muted-foreground">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <p className="font-medium leading-snug">{card.prompt}</p>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge tone="muted">{typeLabels[card.type]}</Badge>
                <Badge tone="primary">{card.points} pts</Badge>
                {card.hint ? <Badge tone="accent">Hint</Badge> : null}
              </div>

              {revealed ? (
                <div className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-sm">
                  <p className="font-medium text-success">{card.answers.join(", ") || "No answer recorded"}</p>
                  {card.explanation ? <p className="mt-1 text-muted-foreground">{card.explanation}</p> : null}
                </div>
              ) : null}
            </div>
          </Surface>
        ))}
      </ol>
    </div>
  );
};
