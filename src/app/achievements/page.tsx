import type { Metadata } from "next";

import { AchievementsGrid } from "@/components/achievements/achievements-grid";

export const metadata: Metadata = { title: "Achievements" };

export default function AchievementsPage() {
  return <AchievementsGrid />;
}
