import { createId } from "./id";
import { type Card, type CardType, type Deck, deckSchema } from "./schema";

const COLUMNS = ["type", "prompt", "options", "answers", "points", "hint", "explanation"] as const;

const escapeCell = (value: string): string => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

/** Split one CSV line, honouring quoted cells and doubled quotes. */
export const parseCsvLine = (line: string): string[] => {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const character = line[i];

    if (quoted) {
      if (character === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        current += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      cells.push(current);
      current = "";
    } else {
      current += character;
    }
  }

  cells.push(current);

  return cells.map(cell => cell.trim());
};

export const deckToCsv = (deck: Deck): string => {
  const rows = deck.cards.map(card =>
    [
      card.type,
      card.prompt,
      card.options.join(" | "),
      card.answers.join(" | "),
      String(card.points),
      card.hint,
      card.explanation,
    ]
      .map(escapeCell)
      .join(","),
  );

  return [COLUMNS.join(","), ...rows].join("\n");
};

const asCardType = (value: string): CardType => {
  const normalized = value.toLowerCase().trim();

  if (normalized === "multi" || normalized === "multiple") return "multi";
  if (normalized === "text" || normalized === "written") return "text";

  return "single";
};

const splitList = (value: string): string[] =>
  value
    .split("|")
    .map(part => part.trim())
    .filter(Boolean);

/**
 * Import a `type,prompt,options,answers,points,hint,explanation` CSV. The
 * header row is optional; rows that cannot produce a prompt are skipped.
 */
export const csvToDeck = (csv: string, title = "Imported deck"): Deck => {
  const lines = csv
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const first = lines[0] ? parseCsvLine(lines[0]) : [];
  const hasHeader = first[0]?.toLowerCase() === "type" && first[1]?.toLowerCase() === "prompt";
  const body = hasHeader ? lines.slice(1) : lines;

  const cards: Card[] = body
    .map(line => parseCsvLine(line))
    .filter(cells => Boolean(cells[1]))
    .map(cells => ({
      accepted: [],
      answers: splitList(cells[3] ?? ""),
      explanation: cells[6] ?? "",
      hint: cells[5] ?? "",
      id: createId("card"),
      options: splitList(cells[2] ?? ""),
      points: Number.parseInt(cells[4] ?? "5", 10) || 5,
      prompt: cells[1] ?? "",
      type: asCardType(cells[0] ?? "single"),
    }));

  const now = Date.now();

  return deckSchema.parse({
    cards,
    createdAt: now,
    id: createId("deck"),
    title,
    updatedAt: now,
  });
};
