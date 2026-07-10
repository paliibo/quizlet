import { describe, expect, it } from "vitest";

import { createRandom, sample, shuffle } from "./shuffle";

describe("createRandom", () => {
  it("is deterministic for a given seed", () => {
    const a = createRandom(42);
    const b = createRandom(42);

    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays inside [0, 1)", () => {
    const random = createRandom(7);

    for (let i = 0; i < 200; i += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("shuffle", () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  it("does not mutate the input", () => {
    const copy = [...items];
    shuffle(items, createRandom(1));

    expect(items).toEqual(copy);
  });

  it("keeps every element exactly once", () => {
    expect(shuffle(items, createRandom(9)).sort((a, b) => a - b)).toEqual(items);
  });

  it("reorders for a seed that is not the identity", () => {
    expect(shuffle(items, createRandom(3))).not.toEqual(items);
  });

  it("handles empty and single-element inputs", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(["only"])).toEqual(["only"]);
  });
});

describe("sample", () => {
  it("takes at most the requested count", () => {
    expect(sample([1, 2, 3, 4], 2, createRandom(5))).toHaveLength(2);
  });

  it("caps at the collection size", () => {
    expect(sample([1, 2], 10, createRandom(5))).toHaveLength(2);
  });

  it("returns nothing for a non-positive count", () => {
    expect(sample([1, 2, 3], -1)).toEqual([]);
  });
});
