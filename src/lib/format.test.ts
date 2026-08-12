import { describe, expect, it } from "vitest";

import { clamp, dayKey, formatDuration, formatPercent, formatRelativeTime, pluralize } from "./format";

describe("formatDuration", () => {
  it("formats under an hour as m:ss", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(65_000)).toBe("1:05");
    expect(formatDuration(600_000)).toBe("10:00");
  });

  it("adds an hours segment past an hour", () => {
    expect(formatDuration(3_725_000)).toBe("1:02:05");
  });

  it("floors negative input at zero", () => {
    expect(formatDuration(-5_000)).toBe("0:00");
  });

  it("renders a dash for a countdown with no limit", () => {
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe("—");
    expect(formatDuration(Number.NaN)).toBe("—");
  });
});

describe("formatPercent", () => {
  it("rounds to a whole percentage", () => {
    expect(formatPercent(0.756)).toBe("76%");
  });

  it("clamps out-of-range ratios", () => {
    expect(formatPercent(1.4)).toBe("100%");
    expect(formatPercent(-0.2)).toBe("0%");
  });
});

describe("clamp", () => {
  it("bounds a value on both sides", () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-5, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
  });
});

describe("pluralize", () => {
  it("uses the singular for exactly one", () => {
    expect(pluralize(1, "card")).toBe("1 card");
    expect(pluralize(0, "card")).toBe("0 cards");
    expect(pluralize(4, "card")).toBe("4 cards");
  });

  it("accepts an irregular plural", () => {
    expect(pluralize(2, "entry", "entries")).toBe("2 entries");
  });
});

describe("formatRelativeTime", () => {
  const now = new Date("2024-06-15T12:00:00").getTime();

  it("describes recent timestamps in relative terms", () => {
    expect(formatRelativeTime(now - 30_000, now)).toBe("just now");
    expect(formatRelativeTime(now - 5 * 60_000, now)).toBe("5m ago");
    expect(formatRelativeTime(now - 3 * 3_600_000, now)).toBe("3h ago");
    expect(formatRelativeTime(now - 2 * 86_400_000, now)).toBe("2d ago");
  });

  it("falls back to a date past a week", () => {
    expect(formatRelativeTime(now - 30 * 86_400_000, now)).toMatch(/\d{4}/);
  });
});

describe("dayKey", () => {
  it("formats a local calendar day", () => {
    expect(dayKey(new Date("2024-01-05T23:30:00").getTime())).toBe("2024-01-05");
  });
});
