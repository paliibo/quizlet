import { deckToCsv } from "./csv";
import type { Deck } from "./schema";

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "deck";

/** Hand the browser a generated file without touching the network. */
export const downloadFile = (filename: string, contents: string, type: string): void => {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement("a");

  anchor.download = filename;
  anchor.href = url;
  anchor.click();

  URL.revokeObjectURL(url);
};

export const downloadDeckJson = (deck: Deck): void =>
  downloadFile(`${slugify(deck.title)}.json`, JSON.stringify(deck, null, 2), "application/json");

export const downloadDeckCsv = (deck: Deck): void =>
  downloadFile(`${slugify(deck.title)}.csv`, deckToCsv(deck), "text/csv");

export const downloadBackup = (state: unknown): void =>
  downloadFile("quizbrain-backup.json", JSON.stringify(state, null, 2), "application/json");
