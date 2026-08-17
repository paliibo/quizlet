"use client";

import { CheckIcon, ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/card";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/cn";
import type { Card, CardType } from "@/lib/schema";

export type CardEditorProps = {
  card: Card;
  errors: string[];
  index: number;
  onChange: (card: Card) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  total: number;
};

const typeLabels: Record<CardType, string> = {
  multi: "Multiple answers",
  single: "One correct option",
  text: "Written answer",
};

const MAX_OPTIONS = 8;

export const CardEditor = ({ card, errors, index, onChange, onMove, onRemove, total }: CardEditorProps) => {
  const patch = (changes: Partial<Card>) => onChange({ ...card, ...changes });

  const setOption = (position: number, label: string) => {
    const previous = card.options[position] ?? "";
    const options = card.options.map((option, i) => (i === position ? label : option));

    // Keep the answer key pointing at the option the author just renamed.
    patch({ answers: card.answers.map(answer => (answer === previous ? label : answer)), options });
  };

  const toggleAnswer = (option: string) => {
    if (card.type === "multi") {
      patch({
        answers: card.answers.includes(option)
          ? card.answers.filter(answer => answer !== option)
          : [...card.answers, option],
      });

      return;
    }

    patch({ answers: [option] });
  };

  const changeType = (type: CardType) => {
    if (type === "text") {
      patch({ answers: card.answers.slice(0, 1), type });

      return;
    }

    const options = card.options.length >= 2 ? card.options : ["Option 1", "Option 2"];
    const answers = card.answers.filter(answer => options.includes(answer));

    patch({ answers: type === "single" ? answers.slice(0, 1) : answers, options, type });
  };

  return (
    <Surface className={cn("p-5", errors.length > 0 && "border-danger/60")}>
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-muted text-xs font-semibold tabular-nums">
          {index + 1}
        </span>
        <h3 className="font-semibold">Card {index + 1}</h3>

        {errors.length > 0 ? <Badge tone="danger">{errors.length} to fix</Badge> : null}

        <div className="ml-auto flex items-center gap-1">
          <Button
            aria-label="Move card up"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            size="icon"
            variant="ghost"
          >
            <ChevronUpIcon />
          </Button>
          <Button
            aria-label="Move card down"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            size="icon"
            variant="ghost"
          >
            <ChevronDownIcon />
          </Button>
          <Button aria-label="Delete card" onClick={onRemove} size="icon" variant="ghost">
            <TrashIcon className="text-danger" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_10rem_9rem]">
        <TextInput
          label="Question"
          onChange={event => patch({ prompt: event.target.value })}
          placeholder="What do you want to be asked?"
          value={card.prompt}
        />

        <Field label="Type">
          <Select onValueChange={value => changeType(value as CardType)} value={card.type}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(typeLabels) as CardType[]).map(type => (
                <SelectItem key={type} value={type}>
                  {typeLabels[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <TextInput
          label="Points"
          max={100}
          min={1}
          onChange={event => patch({ points: Math.max(1, Number(event.target.value) || 1) })}
          type="number"
          value={card.points}
        />
      </div>

      {card.type === "text" ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Correct answer"
            onChange={event => patch({ answers: [event.target.value] })}
            placeholder="The exact answer"
            value={card.answers[0] ?? ""}
          />
          <TextInput
            hint="Comma separated"
            label="Also accept"
            onChange={event =>
              patch({
                accepted: event.target.value
                  .split(",")
                  .map(value => value.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Alternate spellings"
            value={card.accepted.join(", ")}
          />
        </div>
      ) : (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Options — tap the circle to mark {card.type === "multi" ? "each correct answer" : "the correct answer"}
          </p>

          <div className="flex flex-col gap-2">
            {card.options.map((option, position) => {
              const isAnswer = card.answers.includes(option);

              return (
                <div className="flex items-center gap-2" key={position}>
                  <button
                    aria-label={isAnswer ? `Unmark option ${position + 1}` : `Mark option ${position + 1} correct`}
                    aria-pressed={isAnswer}
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center border-2 border-border transition-colors",
                      card.type === "multi" ? "rounded-md" : "rounded-full",
                      isAnswer && "border-chart-correct bg-chart-correct text-white",
                    )}
                    onClick={() => toggleAnswer(option)}
                    type="button"
                  >
                    {isAnswer ? <CheckIcon /> : null}
                  </button>

                  <TextInput
                    aria-label={`Option ${position + 1}`}
                    onChange={event => setOption(position, event.target.value)}
                    placeholder={`Option ${position + 1}`}
                    value={option}
                  />

                  <Button
                    aria-label={`Remove option ${position + 1}`}
                    disabled={card.options.length <= 2}
                    onClick={() =>
                      patch({
                        answers: card.answers.filter(answer => answer !== option),
                        options: card.options.filter((_, i) => i !== position),
                      })
                    }
                    size="icon"
                    variant="ghost"
                  >
                    <TrashIcon />
                  </Button>
                </div>
              );
            })}
          </div>

          <Button
            className="mt-2"
            disabled={card.options.length >= MAX_OPTIONS}
            onClick={() => patch({ options: [...card.options, `Option ${card.options.length + 1}`] })}
            size="sm"
            variant="outline"
          >
            <PlusIcon />
            Add option
          </Button>
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Hint (optional)"
          onChange={event => patch({ hint: event.target.value })}
          placeholder="A nudge, shown on request"
          value={card.hint}
        />
        <TextArea
          className="min-h-0"
          label="Explanation (optional)"
          onChange={event => patch({ explanation: event.target.value })}
          placeholder="Shown in the results so the answer sticks"
          rows={2}
          value={card.explanation}
        />
      </div>

      {errors.length > 0 ? (
        <ul className="mt-3 list-inside list-disc text-xs text-danger">
          {errors.map(error => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </Surface>
  );
};
