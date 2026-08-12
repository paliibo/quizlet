"use client";

import { ArrowLeftIcon, ArrowRightIcon, ClockIcon, ExitIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";

import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useCountdown } from "@/hooks/use-countdown";
import { useDigitKeys } from "@/hooks/use-digit-keys";
import { useHotkey } from "@/hooks/use-hotkey";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/format";
import { routes } from "@/lib/routes";
import { gradeDeck } from "@/lib/scoring";
import { createRandom, shuffle } from "@/lib/shuffle";
import { recordAttempt } from "@/store/actions";
import { useDeck, useMounted, useSettings } from "@/store/hooks";

import { QuestionView } from "./question-view";
import { QuizResults } from "./quiz-results";

export const QuizRunner = ({ deckId }: { deckId: string }) => {
  const deck = useDeck(deckId);
  const settings = useSettings();
  const mounted = useMounted();

  const [seed, setSeed] = useState(1);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timings, setTimings] = useState<Record<string, number>>({});
  const [finishedAt, setFinishedAt] = useState<null | number>(null);
  const startedAt = useRef(Date.now());
  const questionStartedAt = useRef(Date.now());

  // Reshuffle only when the seed changes, so answering never reorders the deck.
  const cards = useMemo(() => {
    if (!deck) return [];

    return settings.shuffleCards ? shuffle(deck.cards, createRandom(seed)) : deck.cards;
  }, [deck, seed, settings.shuffleCards]);

  const optionsByCard = useMemo(() => {
    const map: Record<string, string[]> = {};

    cards.forEach((card, position) => {
      map[card.id] = settings.shuffleOptions ? shuffle(card.options, createRandom(seed + position + 1)) : card.options;
    });

    return map;
  }, [cards, seed, settings.shuffleOptions]);

  const finish = useCallback(() => {
    if (!deck || finishedAt) return;

    const now = Date.now();
    const summary = gradeDeck(deck, answers, timings);

    setFinishedAt(now);
    recordAttempt({
      deckId: deck.id,
      durationMs: now - startedAt.current,
      finishedAt: now,
      maxScore: summary.maxScore,
      mode: "quiz",
      responses: summary.responses,
      score: summary.score,
    });
  }, [answers, deck, finishedAt, timings]);

  const countdown = useCountdown(deck?.timeLimit ?? 0, () => {
    toast("Time is up — grading what you have.", "info");
    finish();
  });

  const card = cards[index];

  const goTo = useCallback(
    (next: number) => {
      if (!card) return;

      const now = Date.now();
      setTimings(current => ({ ...current, [card.id]: (current[card.id] ?? 0) + (now - questionStartedAt.current) }));
      questionStartedAt.current = now;
      setIndex(Math.max(0, Math.min(cards.length - 1, next)));
    },
    [card, cards.length],
  );

  const restart = () => {
    setSeed(current => current + 1);
    setAnswers({});
    setTimings({});
    setIndex(0);
    setFinishedAt(null);
    startedAt.current = Date.now();
    questionStartedAt.current = Date.now();
    countdown.reset();
  };

  const answered = Boolean(card && (answers[card.id]?.filter(Boolean).length ?? 0) > 0);
  const isLast = index === cards.length - 1;
  const running = mounted && Boolean(deck) && !finishedAt;

  useHotkey("arrowright", () => goTo(index + 1), { enabled: running });
  useHotkey("arrowleft", () => goTo(index - 1), { enabled: running });
  useHotkey("enter", () => (isLast ? finish() : goTo(index + 1)), { allowInInputs: true, enabled: running });

  useDigitKeys(position => {
    if (!card || card.type === "text") return;

    const option = (optionsByCard[card.id] ?? card.options)[position];
    if (!option) return;

    setAnswers(current => {
      const selected = current[card.id] ?? [];

      if (card.type === "multi") {
        return {
          ...current,
          [card.id]: selected.includes(option) ? selected.filter(item => item !== option) : [...selected, option],
        };
      }

      return { ...current, [card.id]: selected[0] === option ? [] : [option] };
    });
  }, running);

  if (!mounted) {
    return (
      <Container className="max-w-3xl">
        <Skeleton className="h-96 rounded-xl" />
      </Container>
    );
  }

  if (!deck) notFound();

  if (deck.cards.length === 0) {
    return (
      <Container className="max-w-3xl">
        <Surface className="p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">Nothing to quiz yet</h1>
          <p className="mt-2 text-muted-foreground">Add a few cards to this deck and come back.</p>
          <Button asChild className="mt-4">
            <Link href={routes.deckEdit(deck.id)}>Add cards</Link>
          </Button>
        </Surface>
      </Container>
    );
  }

  if (finishedAt) {
    return (
      <Container className="max-w-3xl">
        <QuizResults
          deck={deck}
          durationMs={finishedAt - startedAt.current}
          onRetry={restart}
          summary={gradeDeck(deck, answers, timings)}
        />
      </Container>
    );
  }

  const lowTime = deck.timeLimit > 0 && countdown.remaining < 60_000;

  return (
    <Container className="max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <Button asChild size="sm" variant="ghost">
          <Link href={routes.deck(deck.id)}>
            <ExitIcon />
            Leave
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-sm tabular-nums text-muted-foreground">
            {index + 1} / {cards.length}
          </span>
          {deck.timeLimit > 0 ? (
            <Badge tone={lowTime ? "danger" : "muted"}>
              <ClockIcon />
              <span className="tabular-nums">{formatDuration(countdown.remaining)}</span>
            </Badge>
          ) : null}
        </div>
      </div>

      <Progress className="mt-3" value={((index + 1) / cards.length) * 100} />

      <Surface className="mt-6 p-6 sm:p-8" key={card?.id}>
        <div className="animate-fade-in">
          {card ? (
            <QuestionView
              card={card}
              onChange={value => setAnswers(current => ({ ...current, [card.id]: value }))}
              options={optionsByCard[card.id] ?? card.options}
              value={answers[card.id] ?? []}
            />
          ) : null}
        </div>
      </Surface>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button disabled={index === 0} onClick={() => goTo(index - 1)} variant="ghost">
          <ArrowLeftIcon />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <span className={cn("text-xs text-muted-foreground", answered && "opacity-0")}>Unanswered</span>
          {isLast ? (
            <Button onClick={finish} variant="primary">
              Finish
            </Button>
          ) : (
            <Button onClick={() => goTo(index + 1)}>
              Next
              <ArrowRightIcon />
            </Button>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">←</kbd>{" "}
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">→</kbd> to move ·{" "}
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">1–9</kbd> to pick ·{" "}
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">Enter</kbd> to continue
      </p>
    </Container>
  );
};
