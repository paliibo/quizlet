import { describe, expect, it } from "vitest";

import { decodeDeck, encodeDeck, shareUrl } from "./share";
import { deckSchema } from "./schema";

const deck = deckSchema.parse({
  accent: "cyan",
  cards: [
    { answers: ["Kyiv"], id: "c1", points: 8, prompt: "Столиця України?", type: "text" },
    { answers: ["a"], id: "c2", options: ["a", "b"], points: 5, prompt: "Pick a", type: "single" },
  ],
  description: "Round trip",
  emoji: "🌍",
  id: "d1",
  title: "Geography ✨",
});

describe("encodeDeck / decodeDeck", () => {
  it("produces a URL-safe token", () => {
    expect(encodeDeck(deck)).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("restores the title, emoji and cards", () => {
    const restored = decodeDeck(encodeDeck(deck));

    expect(restored).toMatchObject({ accent: "cyan", emoji: "🌍", title: "Geography ✨" });
    expect(restored?.cards).toHaveLength(2);
    expect(restored?.cards[0]?.prompt).toBe("Столиця України?");
  });

  it("mints new ids so an imported deck never collides", () => {
    const restored = decodeDeck(encodeDeck(deck));

    expect(restored?.id).not.toBe(deck.id);
    expect(restored?.cards[0]?.id).not.toBe("c1");
  });

  it("returns null for a token that is not a deck", () => {
    expect(decodeDeck("not-a-real-token")).toBeNull();
    expect(decodeDeck("")).toBeNull();
  });
});

describe("shareUrl", () => {
  it("puts the payload in the fragment so it never reaches a server log", () => {
    const url = shareUrl(deck, "https://quizbrain.app");

    expect(url.startsWith("https://quizbrain.app/import#")).toBe(true);
    expect(url).not.toContain("?");
  });
});
