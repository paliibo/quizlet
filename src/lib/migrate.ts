import { z } from "zod";

import { createId } from "./id";
import { type Accent, type AppState, type Card, type Deck, SCHEMA_VERSION, appStateSchema } from "./schema";

/**
 * Shape written by the pre-1.0 app: a bare array of quizzes under the `quiz`
 * key, with `regular` used where we now say `single`.
 */
const legacyQuestionSchema = z.object({
  answer: z.union([z.array(z.string()), z.string()]).default([]),
  options: z.array(z.string()).default([]),
  points: z.coerce.number().default(5),
  title: z.string().default(""),
  type: z.enum(["multi", "regular", "text"]).default("regular"),
});

const legacyQuizSchema = z.object({
  questions: z.array(legacyQuestionSchema).default([]),
  quizTitle: z.string().default("Imported quiz"),
});

export const legacyStateSchema = z.array(legacyQuizSchema);

/** The minimum evidence that a payload came from a previous Quizbrain save. */
const persistedShape = z.object({
  decks: z.array(z.unknown()),
  version: z.number(),
});

const ACCENTS: Accent[] = ["violet", "cyan", "emerald", "amber", "rose", "indigo"];
const EMOJIS = ["🧠", "📚", "🧪", "🌍", "🎯", "🧩"];

const toArray = (value: string | string[]): string[] => (Array.isArray(value) ? value : [value]).filter(Boolean);

const migrateQuestion = (question: z.infer<typeof legacyQuestionSchema>): Card => ({
  accepted: [],
  answers: toArray(question.answer),
  explanation: "",
  hint: "",
  id: createId("card"),
  options: question.options,
  points: Math.max(1, Math.round(question.points) || 5),
  prompt: question.title,
  type: question.type === "regular" ? "single" : question.type,
});

/** Convert one legacy quiz into a v2 deck. */
export const migrateLegacyQuiz = (quiz: z.infer<typeof legacyQuizSchema>, index = 0): Deck => {
  const now = Date.now();

  return {
    accent: ACCENTS[index % ACCENTS.length] ?? "violet",
    cards: quiz.questions.map(migrateQuestion),
    createdAt: now,
    description: "Imported from an earlier version of Quizbrain.",
    emoji: EMOJIS[index % EMOJIS.length] ?? "🧠",
    id: createId("deck"),
    timeLimit: 600,
    title: quiz.quizTitle,
    updatedAt: now,
  };
};

/**
 * Bring any previously persisted payload up to the current schema. Unknown or
 * corrupt input yields `null` so the caller can fall back to seed data rather
 * than crashing on someone's stale localStorage.
 */
export const migrate = (raw: unknown): AppState | null => {
  const legacy = legacyStateSchema.safeParse(raw);
  if (legacy.success) {
    return appStateSchema.parse({
      decks: legacy.data.map(migrateLegacyQuiz),
      version: SCHEMA_VERSION,
    });
  }

  // `appStateSchema` defaults every field, so it would happily turn arbitrary
  // objects into an empty library. Require the two fields a real payload always
  // carries before we accept it as ours.
  const looksPersisted = persistedShape.safeParse(raw).success;
  const current = looksPersisted ? appStateSchema.safeParse(raw) : null;
  if (current?.success) {
    return { ...current.data, version: SCHEMA_VERSION };
  }

  return null;
};
