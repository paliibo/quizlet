import type { Review } from "./schema";

/** How confidently the learner recalled a card, mapped onto SM-2 qualities. */
export const GRADES = {
  again: 0,
  easy: 5,
  good: 4,
  hard: 2,
} as const;

export type Grade = keyof typeof GRADES;

export const DAY_MS = 86_400_000;

export const createReview = (deckId: string, cardId: string, now = Date.now()): Review => ({
  cardId,
  deckId,
  due: now,
  ease: 2.5,
  interval: 0,
  lapses: 0,
  lastReviewedAt: 0,
  repetitions: 0,
  reviewedCount: 0,
});

/**
 * SuperMemo-2, trimmed to what a study app actually needs.
 *
 * A lapse (`again`) resets the repetition streak and schedules the card for the
 * same session; everything else grows the interval by the easiness factor,
 * which itself drifts up for easy cards and down for hard ones.
 */
export const scheduleReview = (review: Review, grade: Grade, now = Date.now()): Review => {
  const quality = GRADES[grade];
  const lapsed = quality < 3;

  const ease = Math.max(1.3, review.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  const repetitions = lapsed ? 0 : review.repetitions + 1;

  let interval: number;
  if (lapsed) {
    interval = 0;
  } else if (repetitions === 1) {
    interval = 1;
  } else if (repetitions === 2) {
    interval = 6;
  } else {
    interval = Math.round(review.interval * ease);
  }

  return {
    ...review,
    due: now + Math.max(interval * DAY_MS, lapsed ? 60_000 : DAY_MS),
    ease: Number(ease.toFixed(2)),
    interval,
    lapses: review.lapses + (lapsed ? 1 : 0),
    lastReviewedAt: now,
    repetitions,
    reviewedCount: review.reviewedCount + 1,
  };
};

export const isDue = (review: Review, now = Date.now()): boolean => review.due <= now;

/** Due cards first (most overdue leading), then never-seen cards. */
export const sortByUrgency = (reviews: Review[], now = Date.now()): Review[] =>
  [...reviews].sort((a, b) => {
    const aDue = isDue(a, now);
    const bDue = isDue(b, now);

    if (aDue !== bDue) return aDue ? -1 : 1;
    if ((a.reviewedCount === 0) !== (b.reviewedCount === 0)) return a.reviewedCount === 0 ? -1 : 1;

    return a.due - b.due;
  });

/**
 * 0..1 sense of how well a card is known, saturating at a two-month interval.
 * Used for the deck mastery rings.
 */
export const masteryOf = (review: Review): number => {
  if (review.reviewedCount === 0) return 0;

  return Math.min(1, Math.log2(review.interval + 1) / Math.log2(61));
};
