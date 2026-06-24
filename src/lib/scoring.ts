import type { Card, Deck, Response } from "./schema";

import { isCloseEnough, normalize } from "./text";

export type GradedAnswer = {
  /** Fraction of the card's points awarded, 0..1. */
  credit: number;
  earned: number;
  /** Options the learner picked that were not part of the answer key. */
  incorrectPicks: string[];
  /** True only for full credit. */
  isCorrect: boolean;
  /** Correct answers the learner missed. */
  missed: string[];
  possible: number;
};

const sameSet = (a: string[], b: string[]): boolean => {
  const left = new Set(a.map(normalize));
  const right = new Set(b.map(normalize));

  return left.size === right.size && [...left].every(value => right.has(value));
};

const gradeText = (card: Card, given: string[]): number => {
  const typed = given[0] ?? "";
  const keys = [...card.answers, ...card.accepted];

  return keys.some(key => isCloseEnough(typed, key)) ? 1 : 0;
};

/**
 * Multi-select uses partial credit: every correct pick earns a share of the
 * points, and every wrong pick cancels one out. Guessing everything therefore
 * scores zero rather than full marks.
 */
const gradeMulti = (card: Card, given: string[]): number => {
  const key = new Set(card.answers.map(normalize));
  if (key.size === 0) return 0;

  const picks = new Set(given.map(normalize));
  let hits = 0;
  let misses = 0;

  picks.forEach(pick => (key.has(pick) ? (hits += 1) : (misses += 1)));

  return Math.max(0, (hits - misses) / key.size);
};

export const gradeCard = (card: Card, given: string[]): GradedAnswer => {
  const possible = card.points;
  const answered = given.filter(value => value !== undefined && value !== null && value !== "");

  let credit = 0;
  if (card.type === "text") {
    credit = gradeText(card, answered);
  } else if (card.type === "multi") {
    credit = gradeMulti(card, answered);
  } else {
    credit = sameSet(answered.slice(0, 1), card.answers.slice(0, 1)) ? 1 : 0;
  }

  const key = card.answers.map(normalize);
  const picks = answered.map(normalize);

  return {
    credit,
    earned: Math.round(possible * credit),
    incorrectPicks: card.type === "text" ? [] : answered.filter(pick => !key.includes(normalize(pick))),
    isCorrect: credit === 1,
    missed: card.type === "text" ? [] : card.answers.filter(answer => !picks.includes(normalize(answer))),
    possible,
  };
};

export type QuizSummary = {
  accuracy: number;
  correct: number;
  maxScore: number;
  partial: number;
  responses: Response[];
  score: number;
  wrong: number;
};

/** Grade a whole run. `answers` is keyed by card id so order never matters. */
export const gradeDeck = (
  deck: Deck,
  answers: Record<string, string[]>,
  timings: Record<string, number> = {},
): QuizSummary => {
  const summary: QuizSummary = {
    accuracy: 0,
    correct: 0,
    maxScore: 0,
    partial: 0,
    responses: [],
    score: 0,
    wrong: 0,
  };

  deck.cards.forEach(card => {
    const graded = gradeCard(card, answers[card.id] ?? []);

    summary.maxScore += graded.possible;
    summary.score += graded.earned;

    if (graded.credit === 1) summary.correct += 1;
    else if (graded.credit > 0) summary.partial += 1;
    else summary.wrong += 1;

    summary.responses.push({
      cardId: card.id,
      correct: graded.isCorrect,
      earned: graded.earned,
      given: answers[card.id] ?? [],
      possible: graded.possible,
      timeMs: timings[card.id] ?? 0,
    });
  });

  summary.accuracy = summary.maxScore === 0 ? 0 : summary.score / summary.maxScore;

  return summary;
};
