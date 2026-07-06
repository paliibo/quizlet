import { describe, expect, it } from "vitest";

import { isCloseEnough, levenshtein, normalize, similarity, typoBudget } from "./text";

describe("normalize", () => {
  it("folds case, accents and punctuation", () => {
    expect(normalize("  Brasília! ")).toBe("brasilia");
    expect(normalize("Türkiye")).toBe("turkiye");
    expect(normalize("light-year")).toBe("light year");
  });

  it("collapses runs of whitespace", () => {
    expect(normalize("New   York\n City")).toBe("new york city");
  });
});

describe("levenshtein", () => {
  it("returns zero for identical strings", () => {
    expect(levenshtein("kitten", "kitten")).toBe(0);
  });

  it("counts substitutions, insertions and deletions", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
    expect(levenshtein("", "abc")).toBe(3);
  });
});

describe("similarity", () => {
  it("scores identical strings as 1", () => {
    expect(similarity("abc", "abc")).toBe(1);
  });

  it("treats two empty strings as identical", () => {
    expect(similarity("", "")).toBe(1);
  });
});

describe("isCloseEnough", () => {
  it("accepts an exact match after normalization", () => {
    expect(isCloseEnough("  kyiv ", "Kyiv")).toBe(true);
  });

  it("forgives a single typo in a long answer", () => {
    expect(isCloseEnough("mitochondrian", "mitochondrion")).toBe(true);
  });

  it("does not forgive typos in short answers", () => {
    expect(isCloseEnough("cat", "car")).toBe(false);
  });

  it("rejects empty input", () => {
    expect(isCloseEnough("", "Kyiv")).toBe(false);
  });
});

describe("typoBudget", () => {
  it("scales the allowance with answer length", () => {
    expect(typoBudget(3)).toBe(0);
    expect(typoBudget(7)).toBe(1);
    expect(typoBudget(12)).toBe(2);
    expect(typoBudget(20)).toBe(3);
  });
});
