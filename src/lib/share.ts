import { createId } from "./id";
import { type Deck, deckSchema } from "./schema";

/**
 * Decks travel in the URL fragment as base64url JSON. We drop ids and
 * timestamps before encoding — they are re-minted on import so a shared deck
 * never collides with something already in the recipient's library.
 */
type Portable = {
  a: Deck["accent"];
  c: Array<Omit<Deck["cards"][number], "id">>;
  d: string;
  e: string;
  l: number;
  t: string;
};

const toBase64Url = (value: string): string => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach(byte => (binary += String.fromCharCode(byte)));

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromBase64Url = (value: string): string => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
};

export const encodeDeck = (deck: Deck): string => {
  const portable: Portable = {
    a: deck.accent,
    c: deck.cards.map(({ id: _id, ...card }) => card),
    d: deck.description,
    e: deck.emoji,
    l: deck.timeLimit,
    t: deck.title,
  };

  return toBase64Url(JSON.stringify(portable));
};

export const decodeDeck = (token: string): Deck | null => {
  try {
    const portable = JSON.parse(fromBase64Url(token)) as Portable;
    const now = Date.now();

    return deckSchema.parse({
      accent: portable.a,
      cards: (portable.c ?? []).map(card => ({ ...card, id: createId("card") })),
      createdAt: now,
      description: portable.d,
      emoji: portable.e,
      id: createId("deck"),
      timeLimit: portable.l,
      title: portable.t,
      updatedAt: now,
    });
  } catch {
    return null;
  }
};

export const shareUrl = (deck: Deck, origin: string): string => `${origin}/import#${encodeDeck(deck)}`;
