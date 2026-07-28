import { describe, expect, it } from "vitest";

import { type LegacyQuiz, migrate, migrateLegacyQuiz } from "./migrate";
import { SCHEMA_VERSION } from "./schema";

const legacyQuiz: LegacyQuiz = {
  questions: [
    { answer: ["Default 1"], options: ["Default 1", "Default 2"], points: 1, title: "Default Question", type: "regular" },
    { answer: "Paris", options: [], points: 3, title: "Capital of France?", type: "text" },
  ],
  quizTitle: "DefaultQuiz",
};

describe("migrateLegacyQuiz", () => {
  it("renames the regular question type to single", () => {
    expect(migrateLegacyQuiz(legacyQuiz).cards[0]?.type).toBe("single");
  });

  it("wraps a bare string answer into an array", () => {
    expect(migrateLegacyQuiz(legacyQuiz).cards[1]?.answers).toEqual(["Paris"]);
  });

  it("keeps the quiz title and mints fresh ids", () => {
    const deck = migrateLegacyQuiz(legacyQuiz);

    expect(deck.title).toBe("DefaultQuiz");
    expect(deck.id).toMatch(/^deck_/);
    expect(new Set(deck.cards.map(card => card.id)).size).toBe(2);
  });

  it("cycles accents so imported decks do not all look alike", () => {
    expect(migrateLegacyQuiz(legacyQuiz, 0).accent).not.toBe(migrateLegacyQuiz(legacyQuiz, 1).accent);
  });
});

describe("migrate", () => {
  it("upgrades a legacy array payload", () => {
    const state = migrate([legacyQuiz]);

    expect(state?.version).toBe(SCHEMA_VERSION);
    expect(state?.decks).toHaveLength(1);
  });

  it("passes a current payload through untouched", () => {
    const current = migrate([legacyQuiz]);
    const again = migrate(current);

    expect(again?.decks[0]?.title).toBe("DefaultQuiz");
  });

  it("returns null for input it cannot understand", () => {
    expect(migrate({ nonsense: true })).toBeNull();
    expect(migrate("not json")).toBeNull();
    expect(migrate(null)).toBeNull();
  });
});
