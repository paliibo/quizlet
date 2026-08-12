"use client";

import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/field";
import type { Card } from "@/lib/schema";

import { OptionRow } from "./option-row";

export type QuestionViewProps = {
  card: Card;
  onChange: (answers: string[]) => void;
  /** Ordered as presented, which may differ from `card.options` when shuffled. */
  options: string[];
  value: string[];
};

export const QuestionView = ({ card, onChange, options, value }: QuestionViewProps) => {
  const [hintShown, setHintShown] = useState(false);

  const toggle = (option: string) => {
    if (card.type === "multi") {
      onChange(value.includes(option) ? value.filter(item => item !== option) : [...value, option]);

      return;
    }

    onChange(value[0] === option ? [] : [option]);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="primary">{card.points} points</Badge>
        {card.type === "multi" ? <Badge tone="accent">Select all that apply</Badge> : null}
        {card.type === "text" ? <Badge tone="accent">Type your answer</Badge> : null}
      </div>

      <h2 className="font-display text-2xl font-semibold leading-snug sm:text-3xl">{card.prompt}</h2>

      {card.hint ? (
        hintShown ? (
          <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{card.hint}</p>
        ) : (
          <Button className="self-start" onClick={() => setHintShown(true)} size="sm" variant="ghost">
            <QuestionMarkCircledIcon />
            Show hint
          </Button>
        )
      ) : null}

      {card.type === "text" ? (
        <TextInput
          aria-label="Your answer"
          autoComplete="off"
          className="text-base"
          onChange={event => onChange([event.target.value])}
          placeholder="Type your answer…"
          value={value[0] ?? ""}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {options.map((option, index) => (
            <OptionRow
              index={index}
              key={option}
              label={option}
              multi={card.type === "multi"}
              onToggle={() => toggle(option)}
              selected={value.includes(option)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
