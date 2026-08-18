"use client";

import { notFound } from "next/navigation";

import { DeckEditor } from "@/components/decks/deck-editor";
import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeck, useMounted } from "@/store/hooks";

export default function EditDeckPage({ params }: { params: { deckId: string } }) {
  const deck = useDeck(params.deckId);
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Container className="max-w-4xl">
        <Skeleton className="h-64 rounded-xl" />
      </Container>
    );
  }

  if (!deck) notFound();

  return <DeckEditor initialDeck={deck} mode="edit" />;
}
