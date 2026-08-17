import type { Card, Deck } from "./schema";

export type DeckIssues = {
  /** Card id → human-readable problems with that card. */
  cards: Record<string, string[]>;
  deck: string[];
  isValid: boolean;
};

const cardIssues = (card: Card): string[] => {
  const issues: string[] = [];

  if (!card.prompt.trim()) issues.push("The question is empty.");

  if (card.type === "text") {
    if (!card.answers[0]?.trim()) issues.push("Written cards need a correct answer.");

    return issues;
  }

  const filled = card.options.filter(option => option.trim().length > 0);
  if (filled.length < 2) issues.push("Provide at least two options.");
  if (new Set(filled.map(option => option.toLowerCase())).size !== filled.length) {
    issues.push("Two options are identical.");
  }

  const answers = card.answers.filter(answer => card.options.includes(answer));
  if (answers.length === 0) issues.push("Mark at least one option as correct.");
  if (card.type === "single" && answers.length > 1) issues.push("Single-choice cards need exactly one answer.");

  return issues;
};

/** Everything wrong with a deck, keyed so the editor can show it in place. */
export const validateDeck = (deck: Deck): DeckIssues => {
  const deckIssues: string[] = [];

  if (!deck.title.trim()) deckIssues.push("Give the deck a title.");
  if (deck.cards.length === 0) deckIssues.push("Add at least one card.");

  const cards: Record<string, string[]> = {};
  deck.cards.forEach(card => {
    const issues = cardIssues(card);

    if (issues.length > 0) cards[card.id] = issues;
  });

  return {
    cards,
    deck: deckIssues,
    isValid: deckIssues.length === 0 && Object.keys(cards).length === 0,
  };
};
