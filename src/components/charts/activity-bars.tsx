"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/cn";
import type { ActivityPoint } from "@/lib/stats";

export type ActivityBarsProps = {
  className?: string;
  data: ActivityPoint[];
  height?: number;
};

const shortDay = (day: string) => {
  const date = new Date(`${day}T00:00:00`);

  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

/**
 * Sessions per day. One series, so no legend — the heading names it. Bars keep
 * a 2px surface gap and a rounded top; the grid stays recessive.
 */
export const ActivityBars = ({ className, data, height = 140 }: ActivityBarsProps) => {
  const [hovered, setHovered] = useState<null | number>(null);
  const titleId = useId();
  const max = Math.max(1, ...data.map(point => point.count));

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-end gap-[2px]" style={{ height }}>
        {data.map((point, index) => {
          const ratio = point.count / max;

          return (
            <button
              aria-describedby={titleId}
              aria-label={`${shortDay(point.day)}: ${point.count} sessions`}
              className="group relative flex h-full flex-1 items-end"
              key={point.day}
              onBlur={() => setHovered(null)}
              onFocus={() => setHovered(index)}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              type="button"
            >
              <span
                className={cn(
                  "w-full rounded-t transition-all duration-300",
                  point.count === 0 ? "bg-chart-grid" : "bg-chart-series",
                  hovered === index && "brightness-110",
                )}
                style={{ height: point.count === 0 ? 3 : `${Math.max(6, ratio * 100)}%` }}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{data[0] ? shortDay(data[0].day) : ""}</span>
        <span>{data[data.length - 1] ? shortDay(data[data.length - 1]!.day) : ""}</span>
      </div>

      <p aria-live="polite" className="mt-1 h-5 text-xs text-muted-foreground" id={titleId}>
        {hovered !== null && data[hovered]
          ? `${shortDay(data[hovered]!.day)} — ${data[hovered]!.count} session${data[hovered]!.count === 1 ? "" : "s"}`
          : "Hover a bar for the day's sessions."}
      </p>
    </div>
  );
};
