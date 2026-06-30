import type { Attempt, Deck, Review } from "./schema";

import { dayKey } from "./format";
import { masteryOf } from "./srs";

export type DeckStats = {
  attempts: number;
  bestAccuracy: number;
  dueCount: number;
  lastAttemptAt: null | number;
  mastery: number;
  averageAccuracy: number;
};

const accuracyOf = (attempt: Attempt): number => (attempt.maxScore === 0 ? 0 : attempt.score / attempt.maxScore);

export const deckStats = (deck: Deck, attempts: Attempt[], reviews: Review[], now = Date.now()): DeckStats => {
  const mine = attempts.filter(attempt => attempt.deckId === deck.id);
  const deckReviews = reviews.filter(review => review.deckId === deck.id);
  const accuracies = mine.map(accuracyOf);

  return {
    attempts: mine.length,
    averageAccuracy: accuracies.length
      ? accuracies.reduce((total, value) => total + value, 0) / accuracies.length
      : 0,
    bestAccuracy: accuracies.length ? Math.max(...accuracies) : 0,
    dueCount: deck.cards.filter(card => {
      const review = deckReviews.find(item => item.cardId === card.id);

      return !review || review.due <= now;
    }).length,
    lastAttemptAt: mine.length ? Math.max(...mine.map(attempt => attempt.finishedAt)) : null,
    mastery: deck.cards.length
      ? deck.cards.reduce((total, card) => {
          const review = deckReviews.find(item => item.cardId === card.id);

          return total + (review ? masteryOf(review) : 0);
        }, 0) / deck.cards.length
      : 0,
  };
};

/**
 * Consecutive days with at least one attempt, counting back from today. A gap
 * of one day is tolerated only when today itself is still empty, so an evening
 * session never breaks a streak the user has not lost yet.
 */
export const currentStreak = (attempts: Attempt[], now = Date.now()): number => {
  if (attempts.length === 0) return 0;

  const days = new Set(attempts.map(attempt => dayKey(attempt.finishedAt)));
  const dayMs = 86_400_000;

  let streak = 0;
  let cursor = now;

  if (!days.has(dayKey(cursor))) {
    cursor -= dayMs;
    if (!days.has(dayKey(cursor))) return 0;
  }

  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor -= dayMs;
  }

  return streak;
};

export const longestStreak = (attempts: Attempt[]): number => {
  const days = [...new Set(attempts.map(attempt => dayKey(attempt.finishedAt)))].sort();
  const dayMs = 86_400_000;

  let best = 0;
  let run = 0;
  let previous: null | number = null;

  days.forEach(key => {
    const time = new Date(`${key}T00:00:00`).getTime();
    run = previous !== null && time - previous === dayMs ? run + 1 : 1;
    previous = time;
    best = Math.max(best, run);
  });

  return best;
};

export type ActivityPoint = { accuracy: number; count: number; day: string };

/** One bucket per day for the last `days` days, oldest first. */
export const activitySeries = (attempts: Attempt[], days = 30, now = Date.now()): ActivityPoint[] => {
  const dayMs = 86_400_000;
  const buckets = new Map<string, { correct: number; count: number; total: number }>();

  for (let i = days - 1; i >= 0; i -= 1) {
    buckets.set(dayKey(now - i * dayMs), { correct: 0, count: 0, total: 0 });
  }

  attempts.forEach(attempt => {
    const bucket = buckets.get(dayKey(attempt.finishedAt));
    if (!bucket) return;

    bucket.count += 1;
    bucket.correct += attempt.score;
    bucket.total += attempt.maxScore;
  });

  return [...buckets.entries()].map(([day, bucket]) => ({
    accuracy: bucket.total === 0 ? 0 : bucket.correct / bucket.total,
    count: bucket.count,
    day,
  }));
};

export type GlobalStats = {
  accuracy: number;
  attempts: number;
  cardsReviewed: number;
  streak: number;
  studyTimeMs: number;
};

export const globalStats = (attempts: Attempt[], reviews: Review[], now = Date.now()): GlobalStats => {
  const totals = attempts.reduce(
    (acc, attempt) => ({
      max: acc.max + attempt.maxScore,
      score: acc.score + attempt.score,
      time: acc.time + attempt.durationMs,
    }),
    { max: 0, score: 0, time: 0 },
  );

  return {
    accuracy: totals.max === 0 ? 0 : totals.score / totals.max,
    attempts: attempts.length,
    cardsReviewed: reviews.reduce((total, review) => total + review.reviewedCount, 0),
    streak: currentStreak(attempts, now),
    studyTimeMs: totals.time,
  };
};
