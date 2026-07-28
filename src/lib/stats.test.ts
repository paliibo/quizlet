import { describe, expect, it } from "vitest";

import type { Attempt } from "./schema";
import { attemptSchema, deckSchema } from "./schema";
import { createReview, scheduleReview } from "./srs";
import { activitySeries, currentStreak, deckStats, globalStats, longestStreak } from "./stats";

const DAY = 86_400_000;
const NOW = new Date("2024-06-15T12:00:00").getTime();

const attempt = (daysAgo: number, score = 8, maxScore = 10): Attempt =>
  attemptSchema.parse({
    deckId: "d1",
    durationMs: 60_000,
    finishedAt: NOW - daysAgo * DAY,
    id: `run-${daysAgo}-${score}`,
    maxScore,
    score,
  });

describe("currentStreak", () => {
  it("is zero with no attempts", () => {
    expect(currentStreak([], NOW)).toBe(0);
  });

  it("counts consecutive days ending today", () => {
    expect(currentStreak([attempt(0), attempt(1), attempt(2)], NOW)).toBe(3);
  });

  it("still counts a streak that ended yesterday", () => {
    expect(currentStreak([attempt(1), attempt(2)], NOW)).toBe(2);
  });

  it("breaks once two days are missed", () => {
    expect(currentStreak([attempt(2), attempt(3)], NOW)).toBe(0);
  });

  it("does not double-count two sessions on the same day", () => {
    expect(currentStreak([attempt(0, 5), attempt(0, 9)], NOW)).toBe(1);
  });
});

describe("longestStreak", () => {
  it("finds the best run anywhere in history", () => {
    const attempts = [attempt(0), attempt(5), attempt(6), attempt(7), attempt(8)];

    expect(longestStreak(attempts)).toBe(4);
  });

  it("is zero without attempts", () => {
    expect(longestStreak([])).toBe(0);
  });
});

describe("activitySeries", () => {
  it("returns one bucket per requested day, oldest first", () => {
    const series = activitySeries([], 7, NOW);

    expect(series).toHaveLength(7);
    expect(series[6]?.day).toBe("2024-06-15");
  });

  it("aggregates accuracy per day", () => {
    const series = activitySeries([attempt(0, 5, 10), attempt(0, 10, 10)], 7, NOW);

    expect(series[6]).toMatchObject({ accuracy: 0.75, count: 2 });
  });

  it("ignores attempts outside the window", () => {
    expect(activitySeries([attempt(90)], 7, NOW).every(point => point.count === 0)).toBe(true);
  });
});

describe("deckStats", () => {
  const deck = deckSchema.parse({
    cards: [
      { answers: ["a"], id: "c1", prompt: "one" },
      { answers: ["b"], id: "c2", prompt: "two" },
    ],
    id: "d1",
    title: "Deck",
  });

  it("counts unseen cards as due", () => {
    expect(deckStats(deck, [], [], NOW).dueCount).toBe(2);
  });

  it("drops a scheduled card out of the due count", () => {
    const review = scheduleReview(createReview("d1", "c1", NOW), "good", NOW);

    expect(deckStats(deck, [], [review], NOW).dueCount).toBe(1);
  });

  it("reports average and best accuracy across attempts", () => {
    const stats = deckStats(deck, [attempt(0, 5, 10), attempt(1, 9, 10)], [], NOW);

    expect(stats.averageAccuracy).toBeCloseTo(0.7);
    expect(stats.bestAccuracy).toBeCloseTo(0.9);
    expect(stats.attempts).toBe(2);
  });

  it("stays at zero mastery for an untouched deck", () => {
    expect(deckStats(deck, [], [], NOW).mastery).toBe(0);
  });
});

describe("globalStats", () => {
  it("aggregates accuracy, time and review counts", () => {
    const reviews = [scheduleReview(createReview("d1", "c1", NOW), "good", NOW)];
    const stats = globalStats([attempt(0, 5, 10), attempt(0, 10, 10)], reviews, NOW);

    expect(stats.accuracy).toBeCloseTo(0.75);
    expect(stats.attempts).toBe(2);
    expect(stats.cardsReviewed).toBe(1);
    expect(stats.studyTimeMs).toBe(120_000);
  });

  it("does not divide by zero on an empty history", () => {
    expect(globalStats([], [], NOW).accuracy).toBe(0);
  });
});
