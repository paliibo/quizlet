import { describe, expect, it } from "vitest";

import type { Attempt, Deck, Review } from "./schema";

import { evaluateAchievements } from "./achievements";
import { attemptSchema, cardSchema, deckSchema } from "./schema";
import { createReview } from "./srs";

const deckWith = (cards: number, id = "d1"): Deck =>
  deckSchema.parse({
    cards: Array.from({ length: cards }, (_, index) =>
      cardSchema.parse({ answers: ["a"], id: `${id}-c${index}`, options: ["a", "b"], prompt: `Q${index}` }),
    ),
    id,
    title: `Deck ${id}`,
  });

const attempt = (score: number, maxScore = 10, durationMs = 60_000): Attempt =>
  attemptSchema.parse({
    deckId: "d1",
    durationMs,
    finishedAt: Date.now(),
    id: `run-${score}-${durationMs}`,
    maxScore,
    score,
  });

const find = (context: Parameters<typeof evaluateAchievements>[0], id: string) =>
  evaluateAchievements(context).find(achievement => achievement.id === id);

const empty = { attempts: [] as Attempt[], decks: [] as Deck[], reviews: [] as Review[] };

describe("evaluateAchievements", () => {
  it("returns every badge locked for a fresh library", () => {
    const achievements = evaluateAchievements(empty);

    expect(achievements).toHaveLength(8);
    expect(achievements.every(achievement => !achievement.unlocked)).toBe(true);
  });

  it("unlocks first steps after a single run", () => {
    expect(find({ ...empty, attempts: [attempt(5)] }, "first-steps")?.unlocked).toBe(true);
  });

  it("unlocks deck builder at ten cards", () => {
    expect(find({ ...empty, decks: [deckWith(9)] }, "deck-builder")?.unlocked).toBe(false);
    expect(find({ ...empty, decks: [deckWith(10)] }, "deck-builder")?.unlocked).toBe(true);
  });

  it("unlocks flawless only on a perfect run", () => {
    expect(find({ ...empty, attempts: [attempt(9)] }, "flawless")?.unlocked).toBe(false);
    expect(find({ ...empty, attempts: [attempt(10)] }, "flawless")?.unlocked).toBe(true);
  });

  it("ignores an empty deck when checking for a perfect run", () => {
    expect(find({ ...empty, attempts: [attempt(0, 0)] }, "flawless")?.unlocked).toBe(false);
  });

  it("reports partial progress toward the review century", () => {
    const reviews = [{ ...createReview("d1", "c1"), reviewedCount: 25 }];

    expect(find({ ...empty, reviews }, "century")?.progress).toBeCloseTo(0.25);
  });

  it("clamps progress at 1 once a goal is passed", () => {
    const reviews = [{ ...createReview("d1", "c1"), reviewedCount: 400 }];

    expect(find({ ...empty, reviews }, "century")?.progress).toBe(1);
  });

  it("unlocks the marathon after an hour of study", () => {
    expect(find({ ...empty, attempts: [attempt(5, 10, 3_600_000)] }, "marathon")?.unlocked).toBe(true);
  });

  it("unlocks librarian at five decks", () => {
    const decks = Array.from({ length: 5 }, (_, index) => deckWith(1, `d${index}`));

    expect(find({ ...empty, decks }, "librarian")?.unlocked).toBe(true);
  });
});
