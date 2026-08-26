import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { deckSchema } from "@/lib/schema";
import { STORAGE_KEY, emptyState } from "@/lib/storage";

import { deleteDeck, duplicateDeck, gradeCardReview, importDecks, recordAttempt, saveDeck } from "./actions";
import { getState, patchSettings, resetStore, setState, subscribe } from "./store";

const memoryStorage = () => {
  const map = new Map<string, string>();

  return {
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => [...map.keys()][index] ?? null,
    get length() {
      return map.size;
    },
    removeItem: (key: string) => map.delete(key),
    setItem: (key: string, value: string) => void map.set(key, value),
  } as Storage;
};

const deck = (id: string, title = "Deck") =>
  deckSchema.parse({ cards: [{ answers: ["a"], id: `${id}-c1`, options: ["a", "b"], prompt: "Q" }], id, title });

describe("store", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: memoryStorage() });
    vi.stubGlobal("localStorage", window.localStorage);
    resetStore(emptyState());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("notifies subscribers when state changes", () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    setState(current => ({ ...current, decks: [deck("d1")] }));
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    setState(current => current);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("persists to localStorage under the versioned key", () => {
    saveDeck(deck("d1", "Persisted"));

    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw as string).decks[0].title).toBe("Persisted");
  });

  it("skips persistence when asked to", () => {
    setState(current => ({ ...current, decks: [deck("d1")] }), { persist: false });

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe("saveDeck", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: memoryStorage() });
    resetStore(emptyState());
  });

  it("prepends a new deck", () => {
    saveDeck(deck("d1", "First"));
    saveDeck(deck("d2", "Second"));

    expect(getState().decks.map(item => item.title)).toEqual(["Second", "First"]);
  });

  it("replaces a deck with the same id instead of duplicating it", () => {
    saveDeck(deck("d1", "Original"));
    saveDeck(deck("d1", "Renamed"));

    expect(getState().decks).toHaveLength(1);
    expect(getState().decks[0]?.title).toBe("Renamed");
  });

  it("stamps updatedAt on every save", () => {
    const before = Date.now() - 1;
    saveDeck(deck("d1"));

    expect(getState().decks[0]!.updatedAt).toBeGreaterThan(before);
  });
});

describe("deleteDeck", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: memoryStorage() });
    resetStore(emptyState());
  });

  it("removes the deck along with its attempts and reviews", () => {
    saveDeck(deck("d1"));
    recordAttempt({
      deckId: "d1",
      durationMs: 0,
      finishedAt: Date.now(),
      maxScore: 10,
      mode: "quiz",
      responses: [],
      score: 5,
    });
    gradeCardReview("d1", "d1-c1", "good");

    deleteDeck("d1");

    expect(getState()).toMatchObject({ attempts: [], decks: [], reviews: [] });
  });

  it("leaves other decks untouched", () => {
    saveDeck(deck("d1"));
    saveDeck(deck("d2"));

    deleteDeck("d1");

    expect(getState().decks.map(item => item.id)).toEqual(["d2"]);
  });
});

describe("duplicateDeck", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: memoryStorage() });
    resetStore(emptyState());
  });

  it("copies the deck with fresh ids and a marked title", () => {
    saveDeck(deck("d1", "Original"));
    const copy = duplicateDeck("d1");

    expect(copy?.id).not.toBe("d1");
    expect(copy?.title).toBe("Original (copy)");
    expect(copy?.cards[0]?.id).not.toBe("d1-c1");
    expect(getState().decks).toHaveLength(2);
  });

  it("returns null for an unknown deck", () => {
    expect(duplicateDeck("nope")).toBeNull();
  });
});

describe("gradeCardReview", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: memoryStorage() });
    resetStore(emptyState());
  });

  it("creates a review the first time a card is graded", () => {
    gradeCardReview("d1", "c1", "good");

    expect(getState().reviews).toHaveLength(1);
    expect(getState().reviews[0]).toMatchObject({ cardId: "c1", repetitions: 1 });
  });

  it("updates the existing review on later grades", () => {
    gradeCardReview("d1", "c1", "good");
    gradeCardReview("d1", "c1", "good");

    expect(getState().reviews).toHaveLength(1);
    expect(getState().reviews[0]?.repetitions).toBe(2);
  });
});

describe("recordAttempt and importDecks", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: memoryStorage() });
    resetStore(emptyState());
  });

  it("puts the newest attempt first and mints an id", () => {
    recordAttempt({ deckId: "d1", durationMs: 0, finishedAt: 1, maxScore: 10, mode: "quiz", responses: [], score: 1 });
    recordAttempt({ deckId: "d1", durationMs: 0, finishedAt: 2, maxScore: 10, mode: "quiz", responses: [], score: 2 });

    expect(getState().attempts[0]?.score).toBe(2);
    expect(getState().attempts[0]?.id).toMatch(/^run_/);
  });

  it("caps stored history so localStorage cannot grow without bound", () => {
    for (let i = 0; i < 520; i += 1) {
      recordAttempt({ deckId: "d1", durationMs: 0, finishedAt: i, maxScore: 1, mode: "quiz", responses: [], score: 1 });
    }

    expect(getState().attempts).toHaveLength(500);
  });

  it("adds imported decks to the front of the library", () => {
    saveDeck(deck("d1", "Existing"));
    importDecks([deck("d2", "Imported")]);

    expect(getState().decks[0]?.title).toBe("Imported");
  });
});

describe("patchSettings", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: memoryStorage() });
    resetStore(emptyState());
  });

  it("merges into the existing settings", () => {
    patchSettings({ shuffleOptions: true });

    expect(getState().settings).toMatchObject({ shuffleCards: true, shuffleOptions: true });
  });
});
