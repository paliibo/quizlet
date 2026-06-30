import type { Attempt, Deck, Review } from "./schema";

import { currentStreak } from "./stats";

export type Achievement = {
  description: string;
  icon: string;
  id: string;
  /** 0..1 progress toward unlocking. */
  progress: number;
  title: string;
  unlocked: boolean;
};

type Context = {
  attempts: Attempt[];
  decks: Deck[];
  reviews: Review[];
};

const ratio = (value: number, target: number) => Math.min(1, target === 0 ? 0 : value / target);

const definitions: Array<{
  description: string;
  icon: string;
  id: string;
  measure: (context: Context) => { target: number; value: number };
  title: string;
}> = [
  {
    description: "Finish your first quiz run.",
    icon: "🌱",
    id: "first-steps",
    measure: ({ attempts }) => ({ target: 1, value: attempts.length }),
    title: "First steps",
  },
  {
    description: "Build a deck with at least 10 cards.",
    icon: "🏗️",
    id: "deck-builder",
    measure: ({ decks }) => ({ target: 10, value: Math.max(0, ...decks.map(deck => deck.cards.length)) }),
    title: "Deck builder",
  },
  {
    description: "Score a perfect run on any deck.",
    icon: "🎯",
    id: "flawless",
    measure: ({ attempts }) => ({
      target: 1,
      value: attempts.filter(attempt => attempt.maxScore > 0 && attempt.score === attempt.maxScore).length,
    }),
    title: "Flawless",
  },
  {
    description: "Study on 7 days in a row.",
    icon: "🔥",
    id: "week-streak",
    measure: ({ attempts }) => ({ target: 7, value: currentStreak(attempts) }),
    title: "Seven-day streak",
  },
  {
    description: "Review 100 flashcards.",
    icon: "📚",
    id: "century",
    measure: ({ reviews }) => ({
      target: 100,
      value: reviews.reduce((total, review) => total + review.reviewedCount, 0),
    }),
    title: "Century of reviews",
  },
  {
    description: "Reach a 21-day interval on any card.",
    icon: "🧠",
    id: "long-term",
    measure: ({ reviews }) => ({ target: 21, value: Math.max(0, ...reviews.map(review => review.interval)) }),
    title: "Long-term memory",
  },
  {
    description: "Keep five decks in your library.",
    icon: "🗂️",
    id: "librarian",
    measure: ({ decks }) => ({ target: 5, value: decks.length }),
    title: "Librarian",
  },
  {
    description: "Spend an hour studying in total.",
    icon: "⏳",
    id: "marathon",
    measure: ({ attempts }) => ({
      target: 3_600_000,
      value: attempts.reduce((total, attempt) => total + attempt.durationMs, 0),
    }),
    title: "Marathon",
  },
];

export const evaluateAchievements = (context: Context): Achievement[] =>
  definitions.map(definition => {
    const { target, value } = definition.measure(context);
    const progress = ratio(value, target);

    return {
      description: definition.description,
      icon: definition.icon,
      id: definition.id,
      progress,
      title: definition.title,
      unlocked: progress >= 1,
    };
  });
