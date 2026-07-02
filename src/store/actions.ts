import { createId } from "@/lib/id";
import { type Attempt, type Deck, type Review, type StudyMode, deckSchema } from "@/lib/schema";
import { type Grade, createReview, scheduleReview } from "@/lib/srs";
import { seedDecks } from "@/lib/seed";
import { clearState, emptyState } from "@/lib/storage";

import { getState, setState } from "./store";

/** Insert a deck, or replace the existing one with the same id. */
export const saveDeck = (deck: Deck): void => {
  const next = deckSchema.parse({ ...deck, updatedAt: Date.now() });

  setState(current => {
    const exists = current.decks.some(item => item.id === next.id);

    return {
      ...current,
      decks: exists ? current.decks.map(item => (item.id === next.id ? next : item)) : [next, ...current.decks],
    };
  });
};

export const deleteDeck = (deckId: string): void => {
  setState(current => ({
    ...current,
    attempts: current.attempts.filter(attempt => attempt.deckId !== deckId),
    decks: current.decks.filter(deck => deck.id !== deckId),
    reviews: current.reviews.filter(review => review.deckId !== deckId),
  }));
};

export const duplicateDeck = (deckId: string): Deck | null => {
  const source = getState().decks.find(deck => deck.id === deckId);
  if (!source) return null;

  const now = Date.now();
  const copy = deckSchema.parse({
    ...source,
    cards: source.cards.map(card => ({ ...card, id: createId("card") })),
    createdAt: now,
    id: createId("deck"),
    title: `${source.title} (copy)`,
    updatedAt: now,
  });

  setState(current => ({ ...current, decks: [copy, ...current.decks] }));

  return copy;
};

export const recordAttempt = (attempt: Omit<Attempt, "id">): Attempt => {
  const saved: Attempt = { ...attempt, id: createId("run") };

  // Keep history bounded so localStorage never becomes the bottleneck.
  setState(current => ({ ...current, attempts: [saved, ...current.attempts].slice(0, 500) }));

  return saved;
};

/** Apply an SM-2 grade, creating the review record on first sight of a card. */
export const gradeCardReview = (deckId: string, cardId: string, grade: Grade): Review => {
  const existing = getState().reviews.find(review => review.deckId === deckId && review.cardId === cardId);
  const next = scheduleReview(existing ?? createReview(deckId, cardId), grade);

  setState(current => ({
    ...current,
    reviews: existing
      ? current.reviews.map(review => (review.deckId === deckId && review.cardId === cardId ? next : review))
      : [...current.reviews, next],
  }));

  return next;
};

export const importDecks = (decks: Deck[]): void => {
  setState(current => ({ ...current, decks: [...decks, ...current.decks] }));
};

export const resetLibrary = (): void => {
  clearState();
  setState(() => ({ ...emptyState(), decks: seedDecks() }));
};

export const eraseEverything = (): void => {
  clearState();
  setState(() => emptyState());
};

export const initialState = () => ({ ...emptyState(), decks: seedDecks() });

export type { StudyMode };
