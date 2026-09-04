"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { todayLocal } from "@/lib/date";
import { itemPoints, lifetimePoints, pointsByDate } from "@/lib/garden-logic";
import { stageFor, traitStates, type TraitState } from "@/lib/grow/traits";
import { currentStreak } from "@/lib/streak";
import { createClient } from "@/lib/supabase/client";
import { fetchAllEntries, fetchGardenState, fetchItems, saveLifetimePoints } from "@/lib/supabase/queries";
import AvatarFigure from "./AvatarFigure";
import CustomisePanel from "./CustomisePanel";
import TraitsList from "./TraitsList";
import ThemeToggle from "./ThemeToggle";
import { useProfile } from "./useProfile";

interface Summary {
  traits: TraitState[];
  streak: number;
  points: number;
}

export default function YouScreen() {
  const { avatar, update } = useProfile();
  const [s, setS] = useState<Summary | null>(null);

  useEffect(() => {
    let cancelled = false;
    const db = createClient();
    Promise.all([fetchAllEntries(db), fetchItems(db), fetchGardenState(db)])
      .then(([entries, items, state]) => {
        if (cancelled) return;
        const pts = itemPoints(items);
        const stored = state?.lifetime_points ?? 0;
        const total = lifetimePoints(entries, pts, stored);
        setS({ traits: traitStates(entries, items), streak: currentStreak(pointsByDate(entries, pts), todayLocal()), points: total });
        if (total > stored) void saveLifetimePoints(db, total).catch(() => {});
      })
      .catch(() => !cancelled && setS({ traits: traitStates([], []), streak: 0, points: 0 }));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!s || avatar === null) return <div className="h-40" aria-hidden />;
  const stage = stageFor(s.traits);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 rounded-[22px] border border-line bg-card p-4">
        <AvatarFigure avatar={avatar} size={110} />
        <div className="flex-1">
          <p className="font-display text-[26px] font-medium leading-tight text-ink">{stage}</p>
          <p className="text-sm text-ink-soft">{s.points.toLocaleString()} lifetime points</p>
          <p className="text-sm text-ink-soft">{s.streak} {s.streak === 1 ? "day" : "days"} in a row</p>
        </div>
      </div>
      <CustomisePanel avatar={avatar} onChange={update} />
      <h2 className="px-1 pt-1 font-display text-xl text-ink">Traits</h2>
      <TraitsList states={s.traits} />
      <h2 className="px-1 pt-1 font-display text-xl text-ink">Settings</h2>
      <ThemeToggle />
      <div className="rounded-[22px] border border-line bg-card p-1">
        <Link href="/settings" className="flex h-13 items-center justify-between px-3.5 text-[15px] font-medium text-ink">Items <span className="text-ink-faint">›</span></Link>
        <div className="mx-3.5 h-px bg-line" />
        <Link href="/stats" className="flex h-13 items-center justify-between px-3.5 text-[15px] font-medium text-ink">Stats <span className="text-ink-faint">›</span></Link>
      </div>
    </div>
  );
}
