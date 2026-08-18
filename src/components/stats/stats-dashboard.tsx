"use client";

import { BarChartIcon, ClockIcon, LightningBoltIcon, TargetIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { AccuracyLine } from "@/components/charts/accuracy-line";
import { ActivityBars } from "@/components/charts/activity-bars";
import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/shared/stat-tile";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Ring } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration, formatPercent, pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { AppState } from "@/lib/schema";
import { activitySeries, deckStats, globalStats, longestStreak } from "@/lib/stats";
import { useAppState, useMounted } from "@/store/hooks";

const selectDashboard = (state: AppState) => ({
  activity: activitySeries(state.attempts, 30),
  decks: state.decks.map(deck => ({ deck, stats: deckStats(deck, state.attempts, state.reviews) })),
  global: globalStats(state.attempts, state.reviews),
  longest: longestStreak(state.attempts),
  modes: state.attempts.reduce<Record<string, number>>((counts, attempt) => {
    counts[attempt.mode] = (counts[attempt.mode] ?? 0) + 1;

    return counts;
  }, {}),
});

export const StatsDashboard = () => {
  const mounted = useMounted();
  const data = useAppState(selectDashboard);

  if (!mounted) {
    return (
      <Container>
        <Skeleton className="h-10 w-64" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton className="h-20 rounded-xl" key={index} />
          ))}
        </div>
        <Skeleton className="mt-6 h-64 rounded-xl" />
      </Container>
    );
  }

  const hasHistory = data.global.attempts > 0;

  return (
    <Container>
      <PageHeader
        description="Everything below is derived from runs on this device."
        eyebrow="Progress"
        title="Your study stats"
      />

      {!hasHistory ? (
        <EmptyState
          action={
            <Button asChild>
              <Link href={routes.home}>Pick a deck</Link>
            </Button>
          }
          className="mt-8"
          description="Finish a quiz or a flashcard session and your streak, accuracy and activity land here."
          icon="📈"
          title="No runs recorded yet"
        />
      ) : (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              hint={`Longest: ${pluralize(data.longest, "day")}`}
              icon={<LightningBoltIcon />}
              label="Current streak"
              value={pluralize(data.global.streak, "day")}
            />
            <StatTile icon={<TargetIcon />} label="Overall accuracy" value={formatPercent(data.global.accuracy)} />
            <StatTile icon={<BarChartIcon />} label="Sessions" value={data.global.attempts} />
            <StatTile icon={<ClockIcon />} label="Time studied" value={formatDuration(data.global.studyTimeMs)} />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Surface className="p-5">
              <h2 className="font-display text-lg font-semibold">Sessions per day</h2>
              <p className="mb-4 text-sm text-muted-foreground">The last 30 days.</p>
              <ActivityBars data={data.activity} />
            </Surface>

            <Surface className="p-5">
              <h2 className="font-display text-lg font-semibold">Accuracy trend</h2>
              <p className="mb-4 text-sm text-muted-foreground">Days you studied, oldest first.</p>
              <AccuracyLine data={data.activity} />
            </Surface>
          </div>

          <Surface className="mt-6 p-5">
            <h2 className="font-display text-lg font-semibold">Sessions by mode</h2>
            <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {(["quiz", "flashcards", "match"] as const).map(mode => (
                <li className="flex items-baseline gap-2" key={mode}>
                  <span className="capitalize text-muted-foreground">{mode}</span>
                  <span className="font-display text-xl font-semibold tabular-nums">{data.modes[mode] ?? 0}</span>
                </li>
              ))}
            </ul>
          </Surface>
        </>
      )}

      <h2 className="mt-10 font-display text-xl font-semibold">Deck mastery</h2>

      {data.decks.length === 0 ? (
        <p className="mt-2 text-muted-foreground">No decks yet.</p>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...data.decks]
            .sort((a, b) => b.stats.mastery - a.stats.mastery)
            .map(({ deck, stats }) => (
              <Surface className="flex items-center gap-4 p-4" interactive key={deck.id}>
                <Ring label={formatPercent(stats.mastery)} value={stats.mastery} />
                <div className="min-w-0">
                  <Link className="font-medium hover:underline" href={routes.deck(deck.id)}>
                    {deck.emoji} {deck.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {stats.dueCount} due · {pluralize(stats.attempts, "run")}
                  </p>
                </div>
              </Surface>
            ))}
        </div>
      )}
    </Container>
  );
};
