"use client";

import { CheckIcon } from "@radix-ui/react-icons";

import { accentNames, accentStyles } from "@/lib/accents";
import { cn } from "@/lib/cn";
import type { Accent } from "@/lib/schema";

export const AccentPicker = ({ onChange, value }: { onChange: (accent: Accent) => void; value: Accent }) => (
  <div className="flex flex-wrap gap-2" role="radiogroup">
    {accentNames.map(accent => (
      <button
        aria-checked={value === accent}
        aria-label={`${accentStyles[accent].label} accent`}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br text-white transition-transform hover:scale-110",
          accentStyles[accent].cover,
          value === accent && "ring-2 ring-foreground ring-offset-2 ring-offset-background",
        )}
        key={accent}
        onClick={() => onChange(accent)}
        role="radio"
        type="button"
      >
        {value === accent ? <CheckIcon /> : null}
      </button>
    ))}
  </div>
);
