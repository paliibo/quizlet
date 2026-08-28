import { z } from "zod";

export const SCHEMA_VERSION = 2;

export const cardTypeSchema = z.enum(["single", "multi", "text"]);

export const accentSchema = z.enum(["violet", "cyan", "emerald", "amber", "rose", "indigo"]);

export const studyModeSchema = z.enum(["quiz", "flashcards", "match"]);

export const cardSchema = z.object({
  /** Alternate spellings accepted for `text` cards, on top of `answers`. */
  accepted: z.array(z.string()).default([]),
  answers: z.array(z.string()).default([]),
  explanation: z.string().default(""),
  hint: z.string().default(""),
  id: z.string(),
  options: z.array(z.string()).default([]),
  points: z.number().int().min(1).max(100).default(5),
  prompt: z.string().default(""),
  type: cardTypeSchema.default("single"),
});

export const deckSchema = z.object({
  accent: accentSchema.default("violet"),
  cards: z.array(cardSchema).default([]),
  createdAt: z.number().default(() => Date.now()),
  description: z.string().default(""),
  emoji: z.string().default("🧠"),
  id: z.string(),
  /** Seconds allowed for a full quiz run; `0` disables the timer. */
  timeLimit: z.number().int().min(0).max(7200).default(600),
  title: z.string().default("Untitled deck"),
  updatedAt: z.number().default(() => Date.now()),
});

export const responseSchema = z.object({
  cardId: z.string(),
  correct: z.boolean(),
  earned: z.number(),
  given: z.array(z.string()),
  possible: z.number(),
  timeMs: z.number().default(0),
});

export const attemptSchema = z.object({
  deckId: z.string(),
  durationMs: z.number().default(0),
  finishedAt: z.number(),
  id: z.string(),
  maxScore: z.number(),
  mode: studyModeSchema.default("quiz"),
  responses: z.array(responseSchema).default([]),
  score: z.number(),
});

export const reviewSchema = z.object({
  cardId: z.string(),
  deckId: z.string(),
  /** Epoch ms at which the card becomes due. */
  due: z.number().default(() => Date.now()),
  /** SM-2 easiness factor. */
  ease: z.number().default(2.5),
  /** Days until the next review. */
  interval: z.number().default(0),
  lapses: z.number().int().default(0),
  lastReviewedAt: z.number().default(0),
  repetitions: z.number().int().default(0),
  reviewedCount: z.number().int().default(0),
});

export const settingsSchema = z.object({
  reducedConfetti: z.boolean().default(false),
  shuffleCards: z.boolean().default(true),
  shuffleOptions: z.boolean().default(false),
  theme: z.enum(["light", "dark", "system"]).default("system"),
});

export const appStateSchema = z.object({
  attempts: z.array(attemptSchema).default([]),
  decks: z.array(deckSchema).default([]),
  reviews: z.array(reviewSchema).default([]),
  settings: settingsSchema.default({}),
  version: z.number().default(SCHEMA_VERSION),
});

export type Accent = z.infer<typeof accentSchema>;
export type AppState = z.infer<typeof appStateSchema>;
export type Attempt = z.infer<typeof attemptSchema>;
export type Card = z.infer<typeof cardSchema>;
export type CardType = z.infer<typeof cardTypeSchema>;
export type Deck = z.infer<typeof deckSchema>;
export type Response = z.infer<typeof responseSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type StudyMode = z.infer<typeof studyModeSchema>;
