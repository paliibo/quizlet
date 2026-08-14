"use client";

import { CheckIcon, ExitIcon, LapTimerIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useHotkey } from "@/hooks/use-hotkey";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import type { Grade } from "@/lib/srs";
import { createReview, isDue, sortByUrgency } from "@/lib/srs";
import { gradeCardReview } from "@/store/actions";
import { useDeck, useMounted, useReviews } from "@/store/hooks";

import { Flashcard } from "./flashcard";

const grades: Array<{ description: string; key: string; tone: string; value: Grade }> = [
  { description: "Forgot it", key: "1", tone: "bg-chart-wrong text-white hover:brightness-110", value: "again" },
  {
    description: "Struggled",
    key: "2",
    tone: "bg-warning text-warning-foreground hover:brightness-110",
    value: "hard",
  },
  {
    description: "Recalled it",
    key: "3",
    tone: "bg-primary text-primary-foreground hover:brightness-110",
    value: "good",
  },
  { description: "Instant", key: "4", tone: "bg-chart-correct text-white hover:brightness-110", value: "easy" },
];

const describeInterval = (days: number): string => {
  if (days <= 0) return "later today";
  if (days === 1) return "tomorrow";
  if (days < 30) return `in ${days} days`;

  return `in ${Math.round(days / 30)} months`;
};

export const FlashcardSession = ({ deckId }: { deckId: string }) => {
  const deck = useDeck(deckId);
  const mounted = useMounted();
  const reviews = useReviews();

  const [flipped, setFlipped] = useState(false);
  const [position, setPosition] = useState(0);
  const [graded, setGraded] = useState(0);
  const [sessionStart] = useState(() => Date.now());

  // The queue is fixed when the session starts: grading a card re-schedules it
  // but must not reshuffle the cards still ahead of the learner.
  const queue = useMemo(() => {
    if (!deck) return [];

    const withReviews = deck.cards.map(card => ({
      card,
      review:
        reviews.find(item => item.deckId === deck.id && item.cardId === card.id) ?? createReview(deck.id, card.id),
    }));

    const ordered = sortByUrgency(
      withReviews.map(item => item.review),
      sessionStart,
    );

    return ordered
      .map(review => withReviews.find(item => item.review.cardId === review.cardId))
      .filter((item): item is (typeof withReviews)[number] => Boolean(item));
    // `reviews` is intentionally omitted: re-reading it after each grade would
    // reorder the queue mid-session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, sessionStart]);

  const current = queue[position];
  const finished = mounted && queue.length > 0 && position >= queue.length;

  const grade = useCallback(
    (value: Grade) => {
      if (!deck || !current) return;

      gradeCardReview(deck.id, current.card.id, value);
      setGraded(count => count + 1);
      setFlipped(false);
      setPosition(index => index + 1);
    },
    [current, deck],
  );

  const canGrade = mounted && Boolean(current) && flipped;

  useHotkey("space", event => {
    event.preventDefault();
    setFlipped(value => !value);
  });
  useHotkey("1", () => grade("again"), { enabled: canGrade });
  useHotkey("2", () => grade("hard"), { enabled: canGrade });
  useHotkey("3", () => grade("good"), { enabled: canGrade });
  useHotkey("4", () => grade("easy"), { enabled: canGrade });

  if (!mounted) {
    return (
      <Container className="max-w-3xl">
        <Skeleton className="h-80 rounded-xl" />
      </Container>
    );
  }

  if (!deck) notFound();

  if (queue.length === 0) {
    return (
      <Container className="max-w-3xl">
        <Surface className="p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">No cards to review</h1>
          <p className="mt-2 text-muted-foreground">Add cards to this deck to start a flashcard session.</p>
          <Button asChild className="mt-4">
            <Link href={routes.deckEdit(deck.id)}>Add cards</Link>
          </Button>
        </Surface>
      </Container>
    );
  }

  if (finished) {
    return (
      <Container className="max-w-3xl">
        <Surface className="animate-pop-in p-8 text-center">
          <p aria-hidden className="text-5xl">
            🎉
          </p>
          <h1 className="mt-3 font-display text-2xl font-semibold">Session complete</h1>
          <p className="mt-2 text-muted-foreground">
            You graded {graded} card{graded === 1 ? "" : "s"}. Quizbrain has scheduled each one for its next review.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button
              onClick={() => {
                setPosition(0);
                setGraded(0);
                setFlipped(false);
              }}
            >
              Go again
            </Button>
            <Button asChild variant="outline">
              <Link href={routes.deck(deck.id)}>Back to deck</Link>
            </Button>
          </div>
        </Surface>
      </Container>
    );
  }

  const dueNow = queue.filter(item => isDue(item.review)).length;

  return (
    <Container className="max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <Button asChild size="sm" variant="ghost">
          <Link href={routes.deck(deck.id)}>
            <ExitIcon />
            Leave
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Badge tone="primary">
            <LapTimerIcon />
            {dueNow} due
          </Badge>
          <span className="text-sm tabular-nums text-muted-foreground">
            {position + 1} / {queue.length}
          </span>
        </div>
      </div>

      <Progress className="mt-3" value={(position / queue.length) * 100} />

      <div className="mt-6">
        {current ? (
          <Flashcard card={current.card} flipped={flipped} onFlip={() => setFlipped(value => !value)} />
        ) : null}
      </div>

      <div className="mt-6">
        {flipped ? (
          <div className="grid animate-slide-up grid-cols-2 gap-2 sm:grid-cols-4">
            {grades.map(({ description, key, tone, value }) => {
              const projected = current ? scheduleProjection(current.review.interval, value) : 0;

              return (
                <button
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-lg px-3 py-3 text-sm font-medium transition-all active:scale-[0.98]",
                    tone,
                  )}
                  key={value}
                  onClick={() => grade(value)}
                  type="button"
                >
                  <span className="capitalize">{value}</span>
                  <span className="text-xs opacity-80">{description}</span>
                  <span className="text-[11px] opacity-70">{describeInterval(projected)}</span>
                  <kbd className="mt-0.5 rounded bg-black/20 px-1.5 text-[10px]">{key}</kbd>
                </button>
              );
            })}
          </div>
        ) : (
          <Button className="w-full" onClick={() => setFlipped(true)} size="lg">
            <CheckIcon />
            Reveal answer
          </Button>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">Space</kbd> flips ·{" "}
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">1–4</kbd> grades your recall
      </p>
    </Container>
  );
};

/** Rough preview of the next interval, so the grade buttons show consequences. */
const scheduleProjection = (interval: number, grade: Grade): number => {
  if (grade === "again") return 0;
  if (interval === 0) return grade === "easy" ? 2 : 1;
  if (interval === 1) return grade === "hard" ? 3 : 6;

  const multiplier = grade === "hard" ? 1.2 : grade === "easy" ? 2.8 : 2.2;

  return Math.round(interval * multiplier);
};
