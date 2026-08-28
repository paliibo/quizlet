"use client";

import { CheckCircledIcon, CrossCircledIcon, HomeIcon, ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { ScoreBreakdown } from "@/components/charts/score-breakdown";
import { useCelebrationClass } from "@/components/shared/celebration";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatDuration, formatPercent } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Deck } from "@/lib/schema";
import type { QuizSummary } from "@/lib/scoring";

export type QuizResultsProps = {
  deck: Deck;
  durationMs: number;
  onRetry: () => void;
  summary: QuizSummary;
};

const verdict = (accuracy: number): { message: string; tone: "accent" | "primary" | "success" | "warning" } => {
  if (accuracy >= 0.9) return { message: "Outstanding recall.", tone: "success" };
  if (accuracy >= 0.7) return { message: "Solid — a couple of gaps left.", tone: "primary" };
  if (accuracy >= 0.4) return { message: "Getting there. Run the flashcards next.", tone: "accent" };

  return { message: "Worth another pass before you move on.", tone: "warning" };
};

export const QuizResults = ({ deck, durationMs, onRetry, summary }: QuizResultsProps) => {
  const { message, tone } = verdict(summary.accuracy);
  const celebrationClass = useCelebrationClass();

  return (
    <div className={cn("flex flex-col gap-6", celebrationClass || "animate-slide-up")}>
      <Surface className="p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Your score</p>

        <div className="mt-1 flex flex-wrap items-end gap-x-4 gap-y-2">
          <p className="text-gradient font-display text-6xl font-semibold tabular-nums leading-none">
            {formatPercent(summary.accuracy)}
          </p>
          <p className="text-lg tabular-nums text-muted-foreground">
            {summary.score} / {summary.maxScore} points
          </p>
          <Badge tone={tone}>{message}</Badge>
        </div>

        <div className="mt-6">
          <ScoreBreakdown correct={summary.correct} partial={summary.partial} wrong={summary.wrong} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Button onClick={onRetry}>
            <ReloadIcon />
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href={routes.flashcards(deck.id)}>Drill the misses</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={routes.deck(deck.id)}>
              <HomeIcon />
              Back to deck
            </Link>
          </Button>
          <span className="ml-auto text-sm tabular-nums text-muted-foreground">
            Finished in {formatDuration(durationMs)}
          </span>
        </div>
      </Surface>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-xl font-semibold">Card by card</h2>

        {summary.responses.map((response, index) => {
          const card = deck.cards.find(item => item.id === response.cardId);
          if (!card) return null;

          const partial = !response.correct && response.earned > 0;

          return (
            <Surface className="p-4" key={response.cardId}>
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                    response.correct ? "bg-chart-correct/15 text-chart-correct" : "bg-chart-wrong/15 text-chart-wrong",
                  )}
                >
                  {response.correct ? <CheckCircledIcon /> : <CrossCircledIcon />}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground">Question {index + 1}</p>
                  <p className="font-medium leading-snug">{card.prompt}</p>

                  <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">You answered</dt>
                      <dd className="font-medium">{response.given.filter(Boolean).join(", ") || "—"}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">Correct</dt>
                      <dd className="font-medium">{card.answers.join(", ")}</dd>
                    </div>
                  </dl>

                  {card.explanation ? (
                    <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                      {card.explanation}
                    </p>
                  ) : null}
                </div>

                <Badge tone={response.correct ? "success" : partial ? "warning" : "danger"}>
                  {response.earned}/{response.possible}
                </Badge>
              </div>
            </Surface>
          );
        })}
      </div>
    </div>
  );
};
