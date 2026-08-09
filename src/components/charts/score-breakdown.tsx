import { CheckCircledIcon, CrossCircledIcon, MinusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/format";

export type ScoreBreakdownProps = {
  className?: string;
  correct: number;
  partial: number;
  wrong: number;
};

/**
 * Part-to-whole for a finished run. Two hues only: partial credit is the
 * correct hue under a hatch, so the chart never leans on a third colour that
 * red-green viewers would struggle to separate from the other two.
 */
export const ScoreBreakdown = ({ className, correct, partial, wrong }: ScoreBreakdownProps) => {
  const total = Math.max(1, correct + partial + wrong);
  const segments = [
    { count: correct, fill: "hsl(var(--chart-correct))", hatched: false, icon: CheckCircledIcon, label: "Correct" },
    { count: partial, fill: "hsl(var(--chart-correct))", hatched: true, icon: MinusCircledIcon, label: "Partial" },
    { count: wrong, fill: "hsl(var(--chart-wrong))", hatched: false, icon: CrossCircledIcon, label: "Wrong" },
  ].filter(segment => segment.count > 0);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full" role="presentation">
        {segments.map(segment => (
          <span
            className="relative h-full first:rounded-l-full last:rounded-r-full"
            key={segment.label}
            style={{
              backgroundColor: segment.fill,
              backgroundImage: segment.hatched
                ? "repeating-linear-gradient(135deg, hsl(var(--card) / 0.65) 0 3px, transparent 3px 7px)"
                : undefined,
              width: `${(segment.count / total) * 100}%`,
            }}
          />
        ))}
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
        {[
          { count: correct, hatched: false, icon: CheckCircledIcon, label: "Correct", tint: "--chart-correct" },
          { count: partial, hatched: true, icon: MinusCircledIcon, label: "Partial", tint: "--chart-correct" },
          { count: wrong, hatched: false, icon: CrossCircledIcon, label: "Wrong", tint: "--chart-wrong" },
        ].map(({ count, hatched, icon: Icon, label, tint }) => (
          <li className="flex items-center gap-1.5 text-sm text-muted-foreground" key={label}>
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-sm"
              style={{
                backgroundColor: `hsl(var(${tint}))`,
                backgroundImage: hatched
                  ? "repeating-linear-gradient(135deg, hsl(var(--card) / 0.65) 0 2px, transparent 2px 4px)"
                  : undefined,
              }}
            />
            <Icon aria-hidden className="text-muted-foreground" />
            <span>
              {label} <span className="font-semibold tabular-nums text-foreground">{count}</span>
            </span>
            <span className="tabular-nums">({formatPercent(count / total)})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
