"use client";

import { useId, useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/format";
import type { ActivityPoint } from "@/lib/stats";

export type AccuracyLineProps = {
  className?: string;
  data: ActivityPoint[];
  height?: number;
};

const WIDTH = 600;

/**
 * Accuracy over time. Days without a session are skipped rather than plotted as
 * zero, so a rest day never looks like a collapse in recall.
 */
export const AccuracyLine = ({ className, data, height = 160 }: AccuracyLineProps) => {
  const [hovered, setHovered] = useState<null | number>(null);
  const gradientId = useId();
  const points = useMemo(() => data.filter(point => point.count > 0), [data]);

  const coords = useMemo(
    () =>
      points.map((point, index) => ({
        point,
        x: points.length === 1 ? WIDTH / 2 : (index / (points.length - 1)) * WIDTH,
        y: height - 12 - point.accuracy * (height - 24),
      })),
    [height, points],
  );

  if (coords.length === 0) {
    return (
      <p className={cn("grid place-items-center text-sm text-muted-foreground", className)} style={{ height }}>
        Finish a run and your accuracy trend appears here.
      </p>
    );
  }

  const line = coords.map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x},${coord.y}`).join(" ");
  const area = `${line} L${coords[coords.length - 1]!.x},${height} L${coords[0]!.x},${height} Z`;
  const active = hovered !== null ? coords[hovered] : null;

  return (
    <div className={cn("relative", className)}>
      <svg
        className="w-full"
        height={height}
        onMouseLeave={() => setHovered(null)}
        preserveAspectRatio="none"
        role="img"
        viewBox={`0 0 ${WIDTH} ${height}`}
      >
        <title>Accuracy over time</title>

        {[0, 0.5, 1].map(level => (
          <line
            className="text-chart-grid"
            key={level}
            stroke="currentColor"
            strokeWidth="1"
            x1="0"
            x2={WIDTH}
            y1={height - 12 - level * (height - 24)}
            y2={height - 12 - level * (height - 24)}
          />
        ))}

        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--chart-series))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="hsl(var(--chart-series))" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          stroke="hsl(var(--chart-series))"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {active ? (
          <circle
            cx={active.x}
            cy={active.y}
            fill="hsl(var(--chart-series))"
            r="5"
            stroke="hsl(var(--card))"
            strokeWidth="2"
          />
        ) : null}

        {coords.map((coord, index) => (
          <rect
            className="cursor-pointer"
            fill="transparent"
            height={height}
            key={coord.point.day}
            onMouseEnter={() => setHovered(index)}
            width={WIDTH / coords.length}
            x={coord.x - WIDTH / coords.length / 2}
            y={0}
          />
        ))}
      </svg>

      <p aria-live="polite" className="mt-1 h-5 text-xs text-muted-foreground">
        {active
          ? `${new Date(`${active.point.day}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short" })} — ${formatPercent(active.point.accuracy)} accuracy`
          : `Latest: ${formatPercent(coords[coords.length - 1]!.point.accuracy)}`}
      </p>
    </div>
  );
};
