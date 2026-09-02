"use client";

import { useEffect, useState } from "react";
import { lifetimePoints, nextPlant, unlockedPlants } from "@/lib/garden-logic";
import { createClient } from "@/lib/supabase/client";
import { fetchAllEntries, fetchGardenState, saveLifetimePoints } from "@/lib/supabase/queries";
import GardenView from "./GardenView";
import GardenStats from "./GardenStats";

export default function GardenScreen() {
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const db = createClient();
    Promise.all([fetchAllEntries(db), fetchGardenState(db)])
      .then(([entries, state]) => {
        const stored = state?.lifetime_points ?? 0;
        const total = lifetimePoints(entries, stored);
        if (cancelled) return;
        setPoints(total);
        if (total > stored) void saveLifetimePoints(db, total).catch(() => {});
      })
      .catch(() => !cancelled && setPoints(0));
    return () => {
      cancelled = true;
    };
  }, []);

  if (points === null) return <div className="h-40" aria-hidden />;

  const unlocked = unlockedPlants(points);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Garden</h1>
      <GardenView plants={unlocked} />
      <GardenStats points={points} next={nextPlant(points)} unlocked={unlocked} />
    </div>
  );
}
