import { describe, expect, it } from "vitest";

import { csvToDeck, deckToCsv, parseCsvLine } from "./csv";
import { deckSchema } from "./schema";

describe("parseCsvLine", () => {
  it("splits plain cells", () => {
    expect(parseCsvLine("single,Capital?,a | b,a,5,,")).toEqual(["single", "Capital?", "a | b", "a", "5", "", ""]);
  });

  it("keeps commas inside quoted cells", () => {
    expect(parseCsvLine('single,"Berlin, Germany",x')).toEqual(["single", "Berlin, Germany", "x"]);
  });

  it("unescapes doubled quotes", () => {
    expect(parseCsvLine('text,"He said ""hi""",y')).toEqual(["text", 'He said "hi"', "y"]);
  });
});

describe("csvToDeck", () => {
  it("skips the header row when present", () => {
    const deck = csvToDeck("type,prompt,options,answers,points,hint,explanation\nsingle,Q1,a | b,a,5,,");

    expect(deck.cards).toHaveLength(1);
    expect(deck.cards[0]).toMatchObject({ answers: ["a"], options: ["a", "b"], points: 5, prompt: "Q1" });
  });

  it("reads a headerless file", () => {
    expect(csvToDeck("single,Q1,a | b,a,5,,").cards).toHaveLength(1);
  });

  it("maps the legacy `regular` type onto single", () => {
    expect(csvToDeck("regular,Q1,a | b,a,5,,").cards[0]?.type).toBe("single");
  });

  it("drops rows without a prompt", () => {
    expect(csvToDeck("single,,a | b,a,5,,\nsingle,Q2,a | b,a,5,,").cards).toHaveLength(1);
  });

  it("falls back to 5 points when the column is missing or unparseable", () => {
    expect(csvToDeck("single,Q1,a | b,a,not-a-number,,").cards[0]?.points).toBe(5);
  });
});

describe("deckToCsv", () => {
  const deck = deckSchema.parse({
    cards: [
      {
        answers: ["Berlin, Germany"],
        id: "c1",
        options: ["Berlin, Germany", 'He said "hi"'],
        points: 7,
        prompt: "Where?",
        type: "single",
      },
    ],
    id: "d1",
    title: "Round trip",
  });

  it("writes a header row", () => {
    expect(deckToCsv(deck).split("\n")[0]).toBe("type,prompt,options,answers,points,hint,explanation");
  });

  it("survives a round trip through the parser", () => {
    const restored = csvToDeck(deckToCsv(deck));

    expect(restored.cards[0]).toMatchObject({
      answers: ["Berlin, Germany"],
      options: ["Berlin, Germany", 'He said "hi"'],
      points: 7,
      prompt: "Where?",
    });
  });
});
