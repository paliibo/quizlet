"use client";

import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

import { DeckCover } from "@/components/decks/deck-cover";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toast";
import { csvToDeck } from "@/lib/csv";
import { pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Deck } from "@/lib/schema";
import { deckSchema } from "@/lib/schema";
import { decodeDeck } from "@/lib/share";
import { importDecks } from "@/store/actions";

export default function ImportPage() {
  const router = useRouter();
  const [pending, setPending] = useState<Deck | null>(null);
  const [checkedLink, setCheckedLink] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Shared decks arrive in the fragment, which never reaches a server.
  useEffect(() => {
    const token = window.location.hash.replace(/^#/, "");
    setCheckedLink(true);

    if (!token) return;

    const decoded = decodeDeck(token);

    if (decoded) setPending(decoded);
    else toast("That share link could not be decoded.", "error");
  }, []);

  const readFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    file
      .text()
      .then(text => {
        if (file.name.endsWith(".csv")) {
          const deck = csvToDeck(text, file.name.replace(/\.csv$/i, ""));

          if (deck.cards.length === 0) {
            toast("No usable rows in that CSV.", "error");

            return;
          }

          setPending(deck);

          return;
        }

        const parsed = deckSchema.safeParse(JSON.parse(text));

        if (!parsed.success) {
          toast("That JSON file is not a Quizbrain deck.", "error");

          return;
        }

        setPending(parsed.data);
      })
      .catch(() => toast("That file could not be read.", "error"));

    event.target.value = "";
  };

  const confirm = () => {
    if (!pending) return;

    importDecks([pending]);
    toast(`Imported “${pending.title}”.`, "success");
    router.push(routes.deck(pending.id));
  };

  return (
    <Container className="max-w-3xl">
      <PageHeader
        description="Open a share link, or load a deck exported as JSON or CSV."
        eyebrow="Import"
        title="Add a deck"
      />

      <input
        accept=".json,.csv,application/json,text/csv"
        className="hidden"
        onChange={readFile}
        ref={fileInput}
        type="file"
      />

      {pending ? (
        <Surface className="mt-8 animate-pop-in p-6">
          <div className="flex items-start gap-4">
            <DeckCover accent={pending.accent} emoji={pending.emoji} size="lg" />
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-semibold">{pending.title}</h2>
              <p className="mt-1 text-muted-foreground">{pending.description || "No description."}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone="primary">{pluralize(pending.cards.length, "card")}</Badge>
                {pending.timeLimit > 0 ? <Badge tone="muted">Timed</Badge> : null}
              </div>
            </div>
          </div>

          <ul className="mt-5 flex max-h-64 flex-col gap-1.5 overflow-y-auto">
            {pending.cards.map((card, index) => (
              <li className="rounded-lg bg-muted px-3 py-2 text-sm" key={card.id}>
                <span className="mr-2 tabular-nums text-muted-foreground">{index + 1}.</span>
                {card.prompt}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={confirm}>
              <CheckIcon />
              Add to my library
            </Button>
            <Button onClick={() => setPending(null)} variant="ghost">
              <Cross2Icon />
              Discard
            </Button>
          </div>
        </Surface>
      ) : (
        <EmptyState
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={() => fileInput.current?.click()}>Choose a file</Button>
              <Button asChild variant="outline">
                <Link href={routes.newDeck}>Build one instead</Link>
              </Button>
            </div>
          }
          className="mt-8"
          description={
            checkedLink
              ? "Paste a share link into the address bar, or pick a .json or .csv file from your computer."
              : "Reading the share link…"
          }
          icon="📥"
          title="Nothing to import yet"
        />
      )}
    </Container>
  );
}
