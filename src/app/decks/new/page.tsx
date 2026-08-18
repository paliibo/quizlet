"use client";

import { useState } from "react";

import { DeckEditor } from "@/components/decks/deck-editor";
import { createId } from "@/lib/id";
import { deckSchema } from "@/lib/schema";

export default function NewDeckPage() {
  // Minted once so the deck (and its cards) keep stable ids while editing.
  const [draft] = useState(() =>
    deckSchema.parse({
      cards: [],
      description: "",
      id: createId("deck"),
      title: "",
    }),
  );

  return <DeckEditor initialDeck={draft} mode="create" />;
}
