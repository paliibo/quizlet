import { describe, expect, it } from "vitest";

import type { Card, Deck } from "./schema";

import { gradeCard, gradeDeck } from "./scoring";
import { cardSchema, deckSchema } from "./schema";

const card = (overrides: Partial<Card> & Pick<Card, "id">): Card => cardSchema.parse({ points: 10, ...overrides });

describe("gradeCard: single choice", () => {
  const single = card({ answers: ["Ottawa"], id: "c1", options: ["Ottawa", "Toronto"], type: "single" });

  it("awards full points for the right option", () => {
    expect(gradeCard(single, ["Ottawa"])).toMatchObject({ credit: 1, earned: 10, isCorrect: true });
  });

  it("awards nothing for the wrong option", () => {
    expect(gradeCard(single, ["Toronto"])).toMatchObject({ credit: 0, earned: 0, isCorrect: false });
  });

  it("treats an unanswered card as wrong and reports what was missed", () => {
    expect(gradeCard(single, [])).toMatchObject({ credit: 0, missed: ["Ottawa"] });
  });
});

describe("gradeCard: multi select", () => {
  const multi = card({
    answers: ["a", "b"],
    id: "c2",
    options: ["a", "b", "c", "d"],
    type: "multi",
  });

  it("awards full points only for the exact set", () => {
    expect(gradeCard(multi, ["a", "b"])).toMatchObject({ credit: 1, earned: 10 });
  });

  it("awards half credit for one of two correct picks", () => {
    expect(gradeCard(multi, ["a"])).toMatchObject({ credit: 0.5, earned: 5 });
  });

  it("cancels a correct pick with an incorrect one", () => {
    expect(gradeCard(multi, ["a", "c"])).toMatchObject({ credit: 0, earned: 0 });
  });

  it("never scores below zero when everything is selected", () => {
    expect(gradeCard(multi, ["a", "b", "c", "d"]).credit).toBe(0);
  });

  it("reports both the wrong picks and the missed answers", () => {
    expect(gradeCard(multi, ["a", "c"])).toMatchObject({ incorrectPicks: ["c"], missed: ["b"] });
  });
});

describe("gradeCard: free text", () => {
  const text = card({ accepted: ["Kiev"], answers: ["Kyiv"], id: "c3", type: "text" });

  it("accepts the canonical answer regardless of case", () => {
    expect(gradeCard(text, ["kyiv"]).isCorrect).toBe(true);
  });

  it("accepts a listed alternate spelling", () => {
    expect(gradeCard(text, ["Kiev"]).isCorrect).toBe(true);
  });

  it("rejects an unrelated answer", () => {
    expect(gradeCard(text, ["Lviv"]).isCorrect).toBe(false);
  });
});

describe("gradeDeck", () => {
  const deck: Deck = deckSchema.parse({
    cards: [
      cardSchema.parse({ answers: ["a"], id: "one", options: ["a", "b"], points: 10, type: "single" }),
      cardSchema.parse({ answers: ["x", "y"], id: "two", options: ["x", "y", "z"], points: 10, type: "multi" }),
      cardSchema.parse({ answers: ["paris"], id: "three", points: 10, type: "text" }),
    ],
    id: "deck",
    title: "Sample",
  });

  it("sums points and classifies each response", () => {
    const summary = gradeDeck(deck, { one: ["a"], three: ["London"], two: ["x"] });

    expect(summary.maxScore).toBe(30);
    expect(summary.score).toBe(15);
    expect(summary).toMatchObject({ correct: 1, partial: 1, wrong: 1 });
    expect(summary.accuracy).toBeCloseTo(0.5);
  });

  it("carries per-card timings into the responses", () => {
    const summary = gradeDeck(deck, { one: ["a"] }, { one: 4200 });

    expect(summary.responses[0]).toMatchObject({ cardId: "one", timeMs: 4200 });
  });

  it("reports zero accuracy for an empty deck rather than dividing by zero", () => {
    const empty = deckSchema.parse({ id: "empty", title: "Empty" });

    expect(gradeDeck(empty, {}).accuracy).toBe(0);
  });
});
