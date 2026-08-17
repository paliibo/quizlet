"use client";

import { cn } from "@/lib/cn";

const EMOJIS = [
  "🧠",
  "📚",
  "🧪",
  "🌍",
  "🎯",
  "🧩",
  "⚡",
  "🪐",
  "🧬",
  "🎨",
  "🎵",
  "💻",
  "📐",
  "🔬",
  "🏛️",
  "🗺️",
  "🧮",
  "📖",
  "🩺",
  "⚖️",
  "🍿",
  "🏔️",
  "🐙",
  "🌱",
  "🚀",
  "🕹️",
  "🧭",
  "💡",
];

export const EmojiPicker = ({ onChange, value }: { onChange: (emoji: string) => void; value: string }) => (
  <div className="flex flex-wrap gap-1.5" role="radiogroup">
    {EMOJIS.map(emoji => (
      <button
        aria-checked={value === emoji}
        aria-label={`Use ${emoji} as the deck icon`}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg border border-border text-lg transition-all hover:scale-110 hover:border-primary/50",
          value === emoji && "border-primary bg-primary/10",
        )}
        key={emoji}
        onClick={() => onChange(emoji)}
        role="radio"
        type="button"
      >
        {emoji}
      </button>
    ))}
  </div>
);
