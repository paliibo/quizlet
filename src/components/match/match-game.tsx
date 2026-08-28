"use client";

import { ExitIcon, LapTimerIcon, ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Celebration, useCelebrationClass } from "@/components/shared/celebration";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/format";
import type { MatchTile } from "@/lib/match";
import { buildBoard, isPair, matchScore, matchableCards } from "@/lib/match";
import { routes } from "@/lib/routes";
import { createRandom } from "@/lib/shuffle";
import { recordAttempt } from "@/store/actions";
import { useDeck, useMounted } from "@/store/hooks";

const PAIRS = 6;

export const MatchGame = ({ deckId }: { deckId: string }) => {
  const deck = useDeck(deckId);
  const mounted = useMounted();

  const [round, setRound] = useState(1);
  const [selected, setSelected] = useState<MatchTile[]>([]);
  const [cleared, setCleared] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(Date.now());
  const recorded = useRef(false);
  const celebrationClass = useCelebrationClass();

  const board = useMemo(() => (deck ? buildBoard(deck, PAIRS, createRandom(round * 7919)) : []), [deck, round]);

  const pairCount = board.length / 2;
  const finished = pairCount > 0 && cleared.length === pairCount;

  useEffect(() => {
    if (finished) return;

    const id = window.setInterval(() => setElapsed(Date.now() - startedAt.current), 200);

    return () => window.clearInterval(id);
  }, [finished, round]);

  const score = matchScore(pairCount, elapsed, mistakes);

  useEffect(() => {
    if (!finished || !deck || recorded.current) return;

    recorded.current = true;
    const now = Date.now();

    recordAttempt({
      deckId: deck.id,
      durationMs: now - startedAt.current,
      finishedAt: now,
      // Compare against a flawless run so match results sit on the same 0..1
      // accuracy scale as quiz runs.
      maxScore: matchScore(pairCount, 0, 0),
      mode: "match",
      responses: [],
      score,
    });
  }, [deck, finished, pairCount, score]);

  const restart = useCallback(() => {
    setRound(current => current + 1);
    setSelected([]);
    setCleared([]);
    setWrongPair([]);
    setMistakes(0);
    setElapsed(0);
    startedAt.current = Date.now();
    recorded.current = false;
  }, []);

  const pick = (tile: MatchTile) => {
    if (cleared.includes(tile.cardId) || selected.some(item => item.id === tile.id)) return;

    const next = [...selected, tile];

    if (next.length < 2) {
      setSelected(next);

      return;
    }

    const [first, second] = next as [MatchTile, MatchTile];

    if (isPair(first, second)) {
      setCleared(current => [...current, first.cardId]);
      setSelected([]);
    } else {
      setMistakes(count => count + 1);
      setWrongPair([first.id, second.id]);
      setSelected([]);
      window.setTimeout(() => setWrongPair([]), 550);
    }
  };

  if (!mounted) {
    return (
      <Container className="max-w-4xl">
        <Skeleton className="h-96 rounded-xl" />
      </Container>
    );
  }

  if (!deck) notFound();

  if (matchableCards(deck).length < 2) {
    return (
      <Container className="max-w-3xl">
        <Surface className="p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">Not enough cards to match</h1>
          <p className="mt-2 text-muted-foreground">
            Match needs at least two cards that have both a question and an answer.
          </p>
          <Button asChild className="mt-4">
            <Link href={routes.deckEdit(deck.id)}>Edit deck</Link>
          </Button>
        </Surface>
      </Container>
    );
  }

  return (
    <Container className="max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <Button asChild size="sm" variant="ghost">
          <Link href={routes.deck(deck.id)}>
            <ExitIcon />
            Leave
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Badge tone={mistakes > 0 ? "danger" : "muted"}>{mistakes} misses</Badge>
          <Badge tone="primary">
            <LapTimerIcon />
            <span className="tabular-nums">{formatDuration(elapsed)}</span>
          </Badge>
        </div>
      </div>

      {finished ? (
        <Surface className={cn("mt-6 p-8 text-center", celebrationClass)}>
          <Celebration emoji="⚡" />
          <h1 className="mt-3 font-display text-2xl font-semibold">Board cleared</h1>
          <p className="mt-2 text-muted-foreground">
            {pairCount} pairs in {formatDuration(elapsed)} with {mistakes} miss{mistakes === 1 ? "" : "es"}.
          </p>
          <p className="text-gradient mt-4 font-display text-5xl font-semibold tabular-nums">{score}</p>
          <p className="text-sm text-muted-foreground">points</p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button onClick={restart}>
              <ReloadIcon />
              Play again
            </Button>
            <Button asChild variant="outline">
              <Link href={routes.deck(deck.id)}>Back to deck</Link>
            </Button>
          </div>
        </Surface>
      ) : (
        <>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pair every question with its answer. {pairCount - cleared.length} left.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {board.map(tile => {
              const isCleared = cleared.includes(tile.cardId);
              const isSelected = selected.some(item => item.id === tile.id);
              const isWrong = wrongPair.includes(tile.id);

              return (
                <button
                  className={cn(
                    "flex min-h-24 items-center justify-center rounded-xl border-2 border-border bg-card p-3 text-center text-sm font-medium transition-all duration-200",
                    "hover:border-primary/50 hover:bg-primary/5",
                    isSelected && "scale-[0.97] border-primary bg-primary/10",
                    isWrong && "border-chart-wrong bg-chart-wrong/10",
                    isCleared && "pointer-events-none scale-95 border-chart-correct/40 bg-chart-correct/10 opacity-40",
                  )}
                  disabled={isCleared}
                  key={tile.id}
                  onClick={() => pick(tile)}
                  type="button"
                >
                  {tile.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </Container>
  );
};
