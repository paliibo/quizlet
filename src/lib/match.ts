import type { Card, Deck } from "./schema";

import { createId } from "./id";
import { shuffle } from "./shuffle";

export type MatchTile = {
  cardId: string;
  id: string;
  label: string;
  side: "answer" | "prompt";
};

/** Cards that can be paired: they need a prompt and at least one answer. */
export const matchableCards = (deck: Deck): Card[] =>
  deck.cards.filter(card => card.prompt.trim().length > 0 && card.answers.some(answer => answer.trim().length > 0));

/**
 * Build a shuffled board of prompt/answer tiles for up to `pairs` cards. Prompt
 * and answer tiles are shuffled together so the two columns never line up.
 */
export const buildBoard = (deck: Deck, pairs = 6, random: () => number = Math.random): MatchTile[] => {
  const cards = shuffle(matchableCards(deck), random).slice(0, pairs);

  const tiles = cards.flatMap<MatchTile>(card => [
    { cardId: card.id, id: createId("tile"), label: card.prompt, side: "prompt" },
    { cardId: card.id, id: createId("tile"), label: card.answers[0] ?? "", side: "answer" },
  ]);

  return shuffle(tiles, random);
};

/** A pair is valid when both tiles belong to the same card but opposite sides. */
export const isPair = (a: MatchTile, b: MatchTile): boolean => a.cardId === b.cardId && a.side !== b.side;

/**
 * Faster is better and mistakes cost time. Scoring stays in one place so the
 * match mode can be tested without rendering it.
 */
export const matchScore = (pairs: number, elapsedMs: number, mistakes: number): number => {
  const base = pairs * 100;
  const speedBonus = Math.max(0, Math.round((pairs * 8000 - elapsedMs) / 100));

  return Math.max(0, base + speedBonus - mistakes * 40);
};
