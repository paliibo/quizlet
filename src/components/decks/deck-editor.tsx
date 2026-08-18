"use client";

import { CheckIcon, DownloadIcon, PlusIcon, UploadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useMemo, useRef, useState } from "react";

import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/card";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { csvToDeck } from "@/lib/csv";
import { downloadDeckCsv } from "@/lib/download";
import { createId } from "@/lib/id";
import { routes } from "@/lib/routes";
import type { Card, Deck } from "@/lib/schema";
import { validateDeck } from "@/lib/validation";
import { saveDeck } from "@/store/actions";

import { AccentPicker } from "./accent-picker";
import { CardEditor } from "./card-editor";
import { DeckCover } from "./deck-cover";
import { EmojiPicker } from "./emoji-picker";

const blankCard = (): Card => ({
  accepted: [],
  answers: [],
  explanation: "",
  hint: "",
  id: createId("card"),
  options: ["Option 1", "Option 2"],
  points: 5,
  prompt: "",
  type: "single",
});

const TIME_LIMITS = [
  { label: "No limit", value: "0" },
  { label: "5 minutes", value: "300" },
  { label: "10 minutes", value: "600" },
  { label: "20 minutes", value: "1200" },
  { label: "45 minutes", value: "2700" },
];

export const DeckEditor = ({ initialDeck, mode }: { initialDeck: Deck; mode: "create" | "edit" }) => {
  const router = useRouter();
  const [deck, setDeck] = useState<Deck>(initialDeck);
  const [showErrors, setShowErrors] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const issues = useMemo(() => validateDeck(deck), [deck]);

  const patch = (changes: Partial<Deck>) => setDeck(current => ({ ...current, ...changes }));

  const updateCard = (index: number, card: Card) =>
    setDeck(current => ({ ...current, cards: current.cards.map((item, i) => (i === index ? card : item)) }));

  const moveCard = (index: number, direction: -1 | 1) =>
    setDeck(current => {
      const target = index + direction;
      if (target < 0 || target >= current.cards.length) return current;

      const cards = [...current.cards];
      const moved = cards[index] as Card;
      cards[index] = cards[target] as Card;
      cards[target] = moved;

      return { ...current, cards };
    });

  const importCsv = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    file
      .text()
      .then(text => {
        const imported = csvToDeck(text, deck.title);

        if (imported.cards.length === 0) {
          toast("No rows in that file matched the expected columns.", "error");

          return;
        }

        setDeck(current => ({ ...current, cards: [...current.cards, ...imported.cards] }));
        toast(`Added ${imported.cards.length} cards from ${file.name}.`, "success");
      })
      .catch(() => toast("That file could not be read.", "error"));

    event.target.value = "";
  };

  const submit = () => {
    if (!issues.isValid) {
      setShowErrors(true);
      toast("Fix the highlighted problems before saving.", "error");

      return;
    }

    saveDeck(deck);
    toast(mode === "create" ? "Deck created." : "Changes saved.", "success");
    router.push(routes.deck(deck.id));
  };

  return (
    <Container className="max-w-4xl">
      <PageHeader
        actions={
          <>
            <input accept=".csv,text/csv" className="hidden" onChange={importCsv} ref={fileInput} type="file" />
            <Button onClick={() => fileInput.current?.click()} variant="outline">
              <UploadIcon />
              Import CSV
            </Button>
            <Button disabled={deck.cards.length === 0} onClick={() => downloadDeckCsv(deck)} variant="outline">
              <DownloadIcon />
              Export CSV
            </Button>
            <Button onClick={submit}>
              <CheckIcon />
              {mode === "create" ? "Create deck" : "Save changes"}
            </Button>
          </>
        }
        eyebrow={mode === "create" ? "New deck" : "Editing"}
        title={mode === "create" ? "Build a deck" : deck.title || "Untitled deck"}
      />

      <Surface className="mt-8 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <DeckCover accent={deck.accent} emoji={deck.emoji} size="lg" />

          <div className="min-w-0 flex-1 space-y-4">
            <TextInput
              error={showErrors && !deck.title.trim() ? "Give the deck a title." : undefined}
              label="Title"
              onChange={event => patch({ title: event.target.value })}
              placeholder="e.g. Organic chemistry — functional groups"
              value={deck.title}
            />

            <TextArea
              label="Description"
              onChange={event => patch({ description: event.target.value })}
              placeholder="What does this deck cover?"
              rows={2}
              value={deck.description}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <Field label="Icon">
              <EmojiPicker onChange={emoji => patch({ emoji })} value={deck.emoji} />
            </Field>
            <Field label="Accent">
              <AccentPicker onChange={accent => patch({ accent })} value={deck.accent} />
            </Field>
          </div>

          <Field label="Quiz time limit">
            <Select onValueChange={value => patch({ timeLimit: Number(value) })} value={String(deck.timeLimit)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_LIMITS.map(limit => (
                  <SelectItem key={limit.value} value={limit.value}>
                    {limit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Surface>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">
          Cards <span className="text-muted-foreground">({deck.cards.length})</span>
        </h2>
        <Button onClick={() => setDeck(current => ({ ...current, cards: [...current.cards, blankCard()] }))}>
          <PlusIcon />
          Add card
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {deck.cards.map((card, index) => (
          <CardEditor
            card={card}
            errors={showErrors ? (issues.cards[card.id] ?? []) : []}
            index={index}
            key={card.id}
            onChange={updated => updateCard(index, updated)}
            onMove={direction => moveCard(index, direction)}
            onRemove={() => setDeck(current => ({ ...current, cards: current.cards.filter((_, i) => i !== index) }))}
            total={deck.cards.length}
          />
        ))}

        {deck.cards.length === 0 ? (
          <Surface className="border-dashed p-10 text-center">
            <p className="text-muted-foreground">No cards yet. Add one, or import a CSV.</p>
          </Surface>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-2">
        <Button asChild variant="ghost">
          <Link href={mode === "create" ? routes.home : routes.deck(deck.id)}>Cancel</Link>
        </Button>
        <Button onClick={submit}>
          <CheckIcon />
          {mode === "create" ? "Create deck" : "Save changes"}
        </Button>
      </div>
    </Container>
  );
};
