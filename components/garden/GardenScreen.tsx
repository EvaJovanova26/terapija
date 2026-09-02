"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { todayLocal } from "@/lib/date";
import { itemPoints, lifetimePoints, nextPlant, pointsByDate, unlockedPlants } from "@/lib/garden-logic";
import { currentStreak } from "@/lib/streak";
import { createClient } from "@/lib/supabase/client";
import { fetchAllEntries, fetchGardenState, fetchItems, saveLifetimePoints } from "@/lib/supabase/queries";
import GardenView from "./GardenView";
import GardenStats from "./GardenStats";

interface Summary {
  points: number;
  streak: number;
}

export default function GardenScreen() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    let cancelled = false;
    const db = createClient();
    Promise.all([fetchAllEntries(db), fetchItems(db), fetchGardenState(db)])
      .then(([entries, items, state]) => {
        const points = itemPoints(items);
        const stored = state?.lifetime_points ?? 0;
        const total = lifetimePoints(entries, points, stored);
        const streak = currentStreak(pointsByDate(entries, points), todayLocal());
        if (cancelled) return;
        setSummary({ points: total, streak });
        if (total > stored) void saveLifetimePoints(db, total).catch(() => {});
      })
      .catch(() => !cancelled && setSummary({ points: 0, streak: 0 }));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!summary) return <div className="h-40" aria-hidden />;

  const unlocked = unlockedPlants(summary.points);
  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Garden</h1>
        <Link href="/settings" className="rounded-xl px-3 py-2 text-sm text-ink-soft active:bg-moss-100" aria-label="Settings">
          Settings
        </Link>
      </header>
      <GardenView plants={unlocked} />
      <GardenStats points={summary.points} streak={summary.streak} next={nextPlant(summary.points)} unlocked={unlocked} />
    </div>
  );
}
