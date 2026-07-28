import { createId } from "./id";
import { type Card, type Deck, deckSchema } from "./schema";

type SeedCard = Omit<Partial<Card>, "id"> & Pick<Card, "prompt">;

const card = (input: SeedCard): Card => ({
  accepted: [],
  answers: [],
  explanation: "",
  hint: "",
  options: [],
  points: 5,
  type: "single",
  ...input,
  id: createId("card"),
});

const deck = (input: {
  accent: Deck["accent"];
  cards: SeedCard[];
  description: string;
  emoji: string;
  title: string;
}): Deck => {
  const now = Date.now();

  return deckSchema.parse({
    accent: input.accent,
    cards: input.cards.map(card),
    createdAt: now,
    description: input.description,
    emoji: input.emoji,
    id: createId("deck"),
    timeLimit: 600,
    title: input.title,
    updatedAt: now,
  });
};

/** Starter library, so a first-time visitor has something to play with. */
export const seedDecks = (): Deck[] => [
  deck({
    accent: "cyan",
    cards: [
      {
        answers: ["Canberra"],
        explanation: "Canberra was purpose-built as a compromise between Sydney and Melbourne.",
        options: ["Sydney", "Canberra", "Melbourne", "Perth"],
        prompt: "What is the capital of Australia?",
      },
      {
        answers: ["Ottawa"],
        options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
        prompt: "What is the capital of Canada?",
      },
      {
        answers: ["Ankara"],
        hint: "It is not the largest city in the country.",
        options: ["Istanbul", "Ankara", "Izmir", "Bursa"],
        prompt: "What is the capital of Türkiye?",
      },
      {
        accepted: ["Kyiv", "Kiev"],
        answers: ["Kyiv"],
        points: 8,
        prompt: "Type the capital of Ukraine.",
        type: "text",
      },
      {
        answers: ["Brasília", "Wellington", "Nairobi"],
        options: ["Brasília", "Wellington", "Sydney", "Nairobi", "Casablanca"],
        points: 10,
        prompt: "Select every city that is a capital.",
        type: "multi",
      },
      {
        answers: ["Bern"],
        explanation: "Switzerland calls Bern a federal city rather than a capital, but it hosts the government.",
        options: ["Zurich", "Geneva", "Bern", "Basel"],
        prompt: "Which Swiss city hosts the federal government?",
      },
    ],
    description: "Match countries to their capital cities.",
    emoji: "🌍",
    title: "World Capitals",
  }),
  deck({
    accent: "amber",
    cards: [
      {
        answers: ["object"],
        explanation: "A historical bug kept for backwards compatibility since 1995.",
        options: ["null", "object", "undefined", "number"],
        prompt: "What does `typeof null` return?",
      },
      {
        answers: ["It is hoisted but not initialised"],
        options: [
          "It is hoisted and initialised to undefined",
          "It is hoisted but not initialised",
          "It is not hoisted at all",
          "It becomes a global",
        ],
        points: 8,
        prompt: "What happens to a `let` binding before its declaration is evaluated?",
      },
      {
        accepted: ["temporal dead zone", "tdz"],
        answers: ["Temporal Dead Zone"],
        points: 8,
        prompt: "Name the region where a `let` binding exists but cannot be read.",
        type: "text",
      },
      {
        answers: ["map", "filter", "slice"],
        explanation: "`push`, `sort` and `splice` all mutate the array they are called on.",
        options: ["map", "push", "filter", "sort", "slice", "splice"],
        points: 12,
        prompt: "Select the array methods that return a new array.",
        type: "multi",
      },
      {
        answers: ["Promise.allSettled"],
        options: ["Promise.all", "Promise.race", "Promise.allSettled", "Promise.any"],
        prompt: "Which combinator waits for every promise regardless of rejection?",
      },
      {
        answers: ["The value of `this` from the enclosing scope"],
        options: [
          "A fresh `this` bound to the caller",
          "The value of `this` from the enclosing scope",
          "Always the global object",
          "undefined in every case",
        ],
        prompt: "What does an arrow function use for `this`?",
      },
    ],
    description: "Types, scope and the quirks that show up in every interview.",
    emoji: "⚡",
    title: "JavaScript Fundamentals",
  }),
  deck({
    accent: "emerald",
    cards: [
      {
        answers: ["Mitochondrion"],
        explanation: "It produces ATP through oxidative phosphorylation.",
        options: ["Ribosome", "Mitochondrion", "Golgi apparatus", "Lysosome"],
        prompt: "Which organelle generates most of the cell's ATP?",
      },
      {
        accepted: ["haemoglobin"],
        answers: ["Hemoglobin"],
        points: 8,
        prompt: "Which protein carries oxygen in red blood cells?",
        type: "text",
      },
      {
        answers: ["206"],
        options: ["186", "196", "206", "216"],
        prompt: "How many bones are in a typical adult human skeleton?",
      },
      {
        answers: ["Liver", "Skin", "Pancreas"],
        options: ["Liver", "Skin", "Femur", "Pancreas", "Cornea"],
        points: 10,
        prompt: "Select the organs capable of meaningful regeneration.",
        type: "multi",
      },
      {
        answers: ["Neuron"],
        hint: "It transmits electrical impulses.",
        options: ["Neuron", "Nephron", "Alveolus", "Villus"],
        prompt: "What is the basic signalling cell of the nervous system?",
      },
    ],
    description: "Cells, systems and the vocabulary that connects them.",
    emoji: "🧬",
    title: "Human Biology",
  }),
  deck({
    accent: "indigo",
    cards: [
      {
        answers: ["Jupiter"],
        options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
        prompt: "Which planet is the largest in the Solar System?",
      },
      {
        accepted: ["light year", "lightyear"],
        answers: ["Light-year"],
        points: 8,
        prompt: "What unit describes the distance light travels in a year?",
        type: "text",
      },
      {
        answers: ["Venus"],
        explanation: "A runaway greenhouse effect makes Venus hotter than Mercury.",
        options: ["Mercury", "Venus", "Mars", "Earth"],
        prompt: "Which planet has the hottest surface?",
      },
      {
        answers: ["Mars", "Venus", "Mercury"],
        options: ["Mars", "Venus", "Jupiter", "Mercury", "Neptune"],
        points: 10,
        prompt: "Select every terrestrial (rocky) planet other than Earth.",
        type: "multi",
      },
      {
        answers: ["About 8 minutes"],
        options: ["About 8 seconds", "About 8 minutes", "About 80 minutes", "About 8 hours"],
        prompt: "How long does sunlight take to reach Earth?",
      },
    ],
    description: "Planets, distances and the physics that holds it together.",
    emoji: "🪐",
    title: "Space & Astronomy",
  }),
];
