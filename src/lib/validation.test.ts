import { describe, expect, it } from "vitest";

import { cardSchema, deckSchema } from "./schema";
import { validateDeck } from "./validation";

const deck = (cards: unknown[], title = "Deck") =>
  deckSchema.parse({ cards: cards.map(card => cardSchema.parse(card)), id: "d1", title });

describe("validateDeck", () => {
  it("accepts a well-formed deck", () => {
    const result = validateDeck(
      deck([{ answers: ["a"], id: "c1", options: ["a", "b"], prompt: "Pick a", type: "single" }]),
    );

    expect(result.isValid).toBe(true);
    expect(result.cards).toEqual({});
  });

  it("requires a title and at least one card", () => {
    const result = validateDeck(deck([], ""));

    expect(result.deck).toEqual(["Give the deck a title.", "Add at least one card."]);
    expect(result.isValid).toBe(false);
  });

  it("flags an empty question", () => {
    const result = validateDeck(deck([{ answers: ["a"], id: "c1", options: ["a", "b"], prompt: " " }]));

    expect(result.cards.c1).toContain("The question is empty.");
  });

  it("requires two options on choice cards", () => {
    const result = validateDeck(deck([{ answers: ["a"], id: "c1", options: ["a"], prompt: "Q" }]));

    expect(result.cards.c1).toContain("Provide at least two options.");
  });

  it("rejects duplicate options regardless of case", () => {
    const result = validateDeck(deck([{ answers: ["a"], id: "c1", options: ["a", "A"], prompt: "Q" }]));

    expect(result.cards.c1).toContain("Two options are identical.");
  });

  it("requires a marked answer", () => {
    const result = validateDeck(deck([{ answers: [], id: "c1", options: ["a", "b"], prompt: "Q" }]));

    expect(result.cards.c1).toContain("Mark at least one option as correct.");
  });

  it("allows exactly one answer on single-choice cards", () => {
    const result = validateDeck(
      deck([{ answers: ["a", "b"], id: "c1", options: ["a", "b"], prompt: "Q", type: "single" }]),
    );

    expect(result.cards.c1).toContain("Single-choice cards need exactly one answer.");
  });

  it("allows several answers on multi-select cards", () => {
    const result = validateDeck(
      deck([{ answers: ["a", "b"], id: "c1", options: ["a", "b", "c"], prompt: "Q", type: "multi" }]),
    );

    expect(result.isValid).toBe(true);
  });

  it("requires a written answer on text cards", () => {
    const result = validateDeck(deck([{ answers: [], id: "c1", prompt: "Q", type: "text" }]));

    expect(result.cards.c1).toContain("Written cards need a correct answer.");
  });
});
