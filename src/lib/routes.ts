export const routes = {
  achievements: "/achievements",
  deck: (deckId: string) => `/decks/${deckId}`,
  deckEdit: (deckId: string) => `/decks/${deckId}/edit`,
  flashcards: (deckId: string) => `/decks/${deckId}/flashcards`,
  home: "/",
  import: "/import",
  match: (deckId: string) => `/decks/${deckId}/match`,
  newDeck: "/decks/new",
  quiz: (deckId: string) => `/decks/${deckId}/quiz`,
  settings: "/settings",
  stats: "/stats",
} as const;
