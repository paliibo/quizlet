import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LEGACY_STORAGE_KEY, STORAGE_KEY, clearState, emptyState, loadState, saveState } from "./storage";

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

const legacyPayload = [
  {
    questions: [{ answer: ["a"], options: ["a", "b"], points: 2, title: "Legacy question", type: "regular" }],
    quizTitle: "Legacy quiz",
  },
];

describe("storage", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: memoryStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null when nothing is stored", () => {
    expect(loadState()).toBeNull();
  });

  it("round-trips a saved state", () => {
    const state = { ...emptyState(), decks: [] };
    saveState(state);

    expect(loadState()?.version).toBe(state.version);
  });

  it("upgrades a legacy payload and removes the old key", () => {
    window.localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(legacyPayload));

    const loaded = loadState();

    expect(loaded?.decks[0]?.title).toBe("Legacy quiz");
    expect(window.localStorage.getItem(LEGACY_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeTruthy();
  });

  it("prefers current state over a legacy payload left behind", () => {
    window.localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(legacyPayload));
    saveState({ ...emptyState(), decks: [] });

    expect(loadState()?.decks).toHaveLength(0);
  });

  it("treats unparseable JSON as no state at all", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not json");

    expect(loadState()).toBeNull();
  });

  it("survives a storage quota error rather than throwing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("window", {
      localStorage: {
        ...memoryStorage(),
        setItem: () => {
          throw new Error("QuotaExceededError");
        },
      },
    });

    expect(() => saveState(emptyState())).not.toThrow();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("clears both the current and legacy keys", () => {
    window.localStorage.setItem(LEGACY_STORAGE_KEY, "[]");
    saveState(emptyState());

    clearState();

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(LEGACY_STORAGE_KEY)).toBeNull();
  });

  it("no-ops outside the browser", () => {
    vi.stubGlobal("window", undefined);

    expect(loadState()).toBeNull();
    expect(() => saveState(emptyState())).not.toThrow();
    expect(() => clearState()).not.toThrow();
  });
});
