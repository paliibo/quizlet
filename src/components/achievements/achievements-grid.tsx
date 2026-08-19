"use client";

import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { evaluateAchievements } from "@/lib/achievements";
import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/format";
import type { AppState } from "@/lib/schema";
import { useAppState, useMounted } from "@/store/hooks";

const selectAchievements = (state: AppState) =>
  evaluateAchievements({ attempts: state.attempts, decks: state.decks, reviews: state.reviews });

export const AchievementsGrid = () => {
  const achievements = useAppState(selectAchievements);
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Container>
        <Skeleton className="h-10 w-64" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-32 rounded-xl" key={index} />
          ))}
        </div>
      </Container>
    );
  }

  const unlocked = achievements.filter(achievement => achievement.unlocked).length;

  return (
    <Container>
      <PageHeader
        description="Small goals that nudge you back into the habit."
        eyebrow="Achievements"
        title={
          <span>
            {unlocked} of {achievements.length} unlocked
          </span>
        }
      />

      <Progress className="mt-6" value={(unlocked / achievements.length) * 100} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map(achievement => (
          <Surface
            className={cn("flex flex-col gap-3 p-5 transition-all", !achievement.unlocked && "opacity-70")}
            key={achievement.id}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn(
                  "grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl",
                  achievement.unlocked ? "bg-gradient-to-br from-primary to-accent shadow-glow" : "bg-muted grayscale",
                )}
              >
                {achievement.icon}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold leading-tight">{achievement.title}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{achievement.description}</p>
              </div>

              {achievement.unlocked ? <Badge tone="success">Unlocked</Badge> : null}
            </div>

            {!achievement.unlocked ? (
              <div className="mt-auto">
                <Progress value={achievement.progress * 100} />
                <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">
                  {formatPercent(achievement.progress)} there
                </p>
              </div>
            ) : null}
          </Surface>
        ))}
      </div>
    </Container>
  );
};
