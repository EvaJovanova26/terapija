"use client";

import { useEffect, useState } from "react";
import { badgeProgress, earnedBadges, type BadgeDef } from "@/lib/badges";
import { todayLocal } from "@/lib/date";
import { itemPoints, lifetimePoints, nextPlant, plotOneFull, pointsByDate, progressToNext, unlockedPlants, type PlantDef } from "@/lib/garden-logic";
import { currentStreak } from "@/lib/streak";
import { createClient } from "@/lib/supabase/client";
import { fetchAllEntries, fetchGardenState, fetchItems, saveLifetimePoints } from "@/lib/supabase/queries";
import GardenScene from "./GardenScene";
import ProgressCard from "./ProgressCard";
import PlantChips from "./PlantChips";
import SecondPlot from "./SecondPlot";

interface Summary {
  points: number;
  streak: number;
  plants: PlantDef[];
  badges: BadgeDef[];
  next: PlantDef | null;
  progress: number;
}

export default function GardenScreen() {
  const [s, setS] = useState<Summary | null>(null);

  useEffect(() => {
    let cancelled = false;
    const db = createClient();
    Promise.all([fetchAllEntries(db), fetchItems(db), fetchGardenState(db)])
      .then(([entries, items, state]) => {
        const pts = itemPoints(items);
        const stored = state?.lifetime_points ?? 0;
        const total = lifetimePoints(entries, pts, stored);
        if (cancelled) return;
        setS({
          points: total,
          streak: currentStreak(pointsByDate(entries, pts), todayLocal()),
          plants: unlockedPlants(total),
          badges: earnedBadges(badgeProgress(entries, items, pts)),
          next: nextPlant(total),
          progress: progressToNext(total),
        });
        if (total > stored) void saveLifetimePoints(db, total).catch(() => {});
      })
      .catch(() => !cancelled && setS({ points: 0, streak: 0, plants: unlockedPlants(0), badges: [], next: nextPlant(0), progress: 0 }));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!s) return <div className="h-40" aria-hidden />;
  const night = new Date().getHours() >= 21 || new Date().getHours() < 5;

  return (
    <div className="-mt-4 flex flex-col gap-3">
      <GardenScene plants={s.plants.slice(0, 10)} badges={s.badges} streak={s.streak} night={night} />
      <ProgressCard points={s.points} progress={s.progress} next={s.next} />
      <PlantChips plants={s.plants} badges={s.badges} />
      {plotOneFull(s.points) && <SecondPlot plants={s.plants} />}
      <p className="px-2 text-xs leading-relaxed text-ink-faint">Points only ever go up. A day after a zero day counts double. Nothing here wilts.</p>
    </div>
  );
}
