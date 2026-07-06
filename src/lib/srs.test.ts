import { describe, expect, it } from "vitest";

import { DAY_MS, createReview, isDue, masteryOf, scheduleReview, sortByUrgency } from "./srs";

const NOW = 1_700_000_000_000;

describe("createReview", () => {
  it("starts due immediately with a neutral ease", () => {
    const review = createReview("deck", "card", NOW);

    expect(review).toMatchObject({ due: NOW, ease: 2.5, interval: 0, repetitions: 0 });
  });
});

describe("scheduleReview", () => {
  it("moves a first success to tomorrow", () => {
    const review = scheduleReview(createReview("d", "c", NOW), "good", NOW);

    expect(review.interval).toBe(1);
    expect(review.due).toBe(NOW + DAY_MS);
  });

  it("uses a six-day interval on the second success", () => {
    let review = scheduleReview(createReview("d", "c", NOW), "good", NOW);
    review = scheduleReview(review, "good", NOW);

    expect(review.interval).toBe(6);
  });

  it("multiplies by the ease factor from the third success onward", () => {
    let review = createReview("d", "c", NOW);
    for (let i = 0; i < 3; i += 1) review = scheduleReview(review, "good", NOW);

    expect(review.interval).toBeGreaterThan(6);
    expect(review.repetitions).toBe(3);
  });

  it("raises ease for easy grades and lowers it for hard ones", () => {
    const easy = scheduleReview(createReview("d", "c", NOW), "easy", NOW);
    const hard = scheduleReview(createReview("d", "c", NOW), "hard", NOW);

    expect(easy.ease).toBeGreaterThan(2.5);
    expect(hard.ease).toBeLessThan(2.5);
  });

  it("never lets ease fall below the SM-2 floor", () => {
    let review = createReview("d", "c", NOW);
    for (let i = 0; i < 20; i += 1) review = scheduleReview(review, "again", NOW);

    expect(review.ease).toBeGreaterThanOrEqual(1.3);
  });

  it("resets the streak and re-queues the card within the session on a lapse", () => {
    let review = scheduleReview(createReview("d", "c", NOW), "good", NOW);
    review = scheduleReview(review, "again", NOW);

    expect(review).toMatchObject({ interval: 0, lapses: 1, repetitions: 0 });
    expect(review.due - NOW).toBeLessThan(DAY_MS);
  });

  it("counts every review, including lapses", () => {
    let review = createReview("d", "c", NOW);
    review = scheduleReview(review, "good", NOW);
    review = scheduleReview(review, "again", NOW);

    expect(review.reviewedCount).toBe(2);
  });
});

describe("isDue", () => {
  it("is true once the due timestamp has passed", () => {
    const review = scheduleReview(createReview("d", "c", NOW), "good", NOW);

    expect(isDue(review, NOW)).toBe(false);
    expect(isDue(review, NOW + 2 * DAY_MS)).toBe(true);
  });
});

describe("sortByUrgency", () => {
  it("puts due cards first, then unseen cards, then the rest by due date", () => {
    const due = { ...createReview("d", "due", NOW), due: NOW - DAY_MS, reviewedCount: 3 };
    const unseen = createReview("d", "unseen", NOW + DAY_MS);
    const later = { ...createReview("d", "later", NOW), due: NOW + 10 * DAY_MS, reviewedCount: 5 };

    expect(sortByUrgency([later, unseen, due], NOW).map(review => review.cardId)).toEqual(["due", "unseen", "later"]);
  });
});

describe("masteryOf", () => {
  it("is zero for a card that was never reviewed", () => {
    expect(masteryOf(createReview("d", "c", NOW))).toBe(0);
  });

  it("saturates at 1 for very long intervals", () => {
    const review = { ...createReview("d", "c", NOW), interval: 365, reviewedCount: 9 };

    expect(masteryOf(review)).toBe(1);
  });

  it("grows with the interval", () => {
    const short = { ...createReview("d", "c", NOW), interval: 1, reviewedCount: 1 };
    const long = { ...createReview("d", "c", NOW), interval: 21, reviewedCount: 5 };

    expect(masteryOf(long)).toBeGreaterThan(masteryOf(short));
  });
});
