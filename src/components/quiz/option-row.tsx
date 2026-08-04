"use client";

import { CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/cn";

export type OptionRowProps = {
  index: number;
  label: string;
  multi?: boolean;
  onToggle: () => void;
  selected: boolean;
  /** Set once an answer is locked in, to paint correctness. */
  state?: "correct" | "missed" | "neutral" | "wrong";
};

const stateStyles: Record<NonNullable<OptionRowProps["state"]>, string> = {
  correct: "border-success bg-success/10",
  missed: "border-success/50 border-dashed bg-success/5",
  neutral: "",
  wrong: "border-danger bg-danger/10",
};

/** One answer option. Numbered so the 1–9 hotkeys have a visible affordance. */
export const OptionRow = ({ index, label, multi = false, onToggle, selected, state = "neutral" }: OptionRowProps) => (
  <button
    aria-pressed={selected}
    className={cn(
      "group flex w-full items-center gap-3 rounded-xl border-2 border-border bg-surface px-4 py-3 text-left transition-all",
      "hover:border-primary/50 hover:bg-primary/5 active:scale-[0.995]",
      selected && state === "neutral" && "border-primary bg-primary/10",
      state !== "neutral" && stateStyles[state],
    )}
    onClick={onToggle}
    type="button"
  >
    <span
      className={cn(
        "grid h-7 w-7 shrink-0 place-items-center border-2 border-border text-xs font-semibold transition-colors",
        multi ? "rounded-md" : "rounded-full",
        selected && "border-primary bg-primary text-primary-foreground",
        state === "correct" && "border-success bg-success text-success-foreground",
        state === "wrong" && "border-danger bg-danger text-danger-foreground",
      )}
    >
      {selected || state === "correct" ? <CheckIcon /> : index + 1}
    </span>

    <span className="flex-1 text-sm font-medium leading-snug">{label}</span>
  </button>
);
