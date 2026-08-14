import { describe, expect, it } from "vitest";

import { buildBoard, isPair, matchScore, matchableCards } from "./match";
import { deckSchema } from "./schema";
import { createRandom } from "./shuffle";

const deck = deckSchema.parse({
  cards: [
    { answers: ["Ottawa"], id: "c1", prompt: "Canada" },
    { answers: ["Paris"], id: "c2", prompt: "France" },
    { answers: ["Rome"], id: "c3", prompt: "Italy" },
    { answers: [], id: "c4", prompt: "No answer" },
    { answers: ["Orphan"], id: "c5", prompt: "  " },
  ],
  id: "d1",
  title: "Capitals",
});

describe("matchableCards", () => {
  it("skips cards without a prompt or an answer", () => {
    expect(matchableCards(deck).map(card => card.id)).toEqual(["c1", "c2", "c3"]);
  });
});

describe("buildBoard", () => {
  it("emits two tiles per card", () => {
    expect(buildBoard(deck, 3, createRandom(1))).toHaveLength(6);
  });

  it("caps the board at the requested pair count", () => {
    expect(buildBoard(deck, 2, createRandom(1))).toHaveLength(4);
  });

  it("gives every tile a unique id", () => {
    const board = buildBoard(deck, 3, createRandom(2));

    expect(new Set(board.map(tile => tile.id)).size).toBe(6);
  });

  it("pairs one prompt with one answer per card", () => {
    const board = buildBoard(deck, 3, createRandom(3));
    const prompts = board.filter(tile => tile.side === "prompt");

    expect(prompts).toHaveLength(3);
    expect(new Set(board.map(tile => tile.cardId)).size).toBe(3);
  });
});

describe("isPair", () => {
  const prompt = { cardId: "c1", id: "t1", label: "Canada", side: "prompt" } as const;
  const answer = { cardId: "c1", id: "t2", label: "Ottawa", side: "answer" } as const;
  const other = { cardId: "c2", id: "t3", label: "Paris", side: "answer" } as const;

  it("matches opposite sides of the same card", () => {
    expect(isPair(prompt, answer)).toBe(true);
  });

  it("rejects two tiles from the same side", () => {
    expect(isPair(answer, { ...other, cardId: "c1" })).toBe(false);
  });

  it("rejects tiles from different cards", () => {
    expect(isPair(prompt, other)).toBe(false);
  });
});

describe("matchScore", () => {
  it("rewards a faster board", () => {
    expect(matchScore(6, 10_000, 0)).toBeGreaterThan(matchScore(6, 40_000, 0));
  });

  it("penalises mistakes", () => {
    expect(matchScore(6, 20_000, 3)).toBeLessThan(matchScore(6, 20_000, 0));
  });

  it("never goes negative", () => {
    expect(matchScore(2, 600_000, 200)).toBe(0);
  });
});
