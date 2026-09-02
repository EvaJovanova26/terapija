import { longestStreak } from "./streak";
import { pointsByDate, type PointsById } from "./garden-logic";
import type { EntryDraft, Item } from "./types";

/**
 * Earned garden objects. Each rule is a lifetime count, so once earned
 * an object never leaves. Tune here.
 */
export type BadgeKind = "birdbath" | "lantern" | "path" | "bench";

export interface BadgeDef {
  kind: BadgeKind;
  name: string;
  rule: string;
  /** Scene placement on a 390×250 canvas. */
  x: number;
  y: number;
  w: number;
}

export const BADGES: BadgeDef[] = [
  { kind: "birdbath", name: "birdbath", rule: "a 30-day streak", x: 176, y: 58, w: 46 },
  { kind: "lantern", name: "lantern", rule: "seven full-Core days", x: 198, y: 106, w: 30 },
  { kind: "path", name: "stone path", rule: "100 days logged", x: 146, y: 0, w: 66 },
  { kind: "bench", name: "bench", rule: "ten Superpowers", x: 138, y: 104, w: 58 },
];

export const STREAK_FOR_BIRDBATH = 30;
export const FULL_CORE_DAYS_FOR_LANTERN = 7;
export const DAYS_FOR_PATH = 100;
export const SUPERPOWERS_FOR_BENCH = 10;

export interface BadgeProgress {
  longestStreak: number;
  fullCoreDays: number;
  daysLogged: number;
  superpowers: number;
}

export function badgeProgress(entries: EntryDraft[], items: Item[], points: PointsById): BadgeProgress {
  const byDate = pointsByDate(entries, points);
  const core = new Set(items.filter((i) => i.group_name === "core" && !i.retired_at).map((i) => i.id));
  const supers = new Set(items.filter((i) => i.group_name === "superpower").map((i) => i.id));
  let fullCoreDays = 0;
  let superpowers = 0;
  for (const e of entries) {
    const done = new Set(e.done_items);
    if (core.size > 0 && [...core].every((id) => done.has(id))) fullCoreDays += 1;
    superpowers += e.done_items.filter((id) => supers.has(id)).length;
  }
  return {
    longestStreak: longestStreak(byDate),
    fullCoreDays,
    daysLogged: entries.filter((e) => (byDate.get(e.date) ?? 0) > 0).length,
    superpowers,
  };
}

export function earnedBadges(p: BadgeProgress): BadgeDef[] {
  const ok: Record<BadgeKind, boolean> = {
    birdbath: p.longestStreak >= STREAK_FOR_BIRDBATH,
    lantern: p.fullCoreDays >= FULL_CORE_DAYS_FOR_LANTERN,
    path: p.daysLogged >= DAYS_FOR_PATH,
    bench: p.superpowers >= SUPERPOWERS_FOR_BENCH,
  };
  return BADGES.filter((b) => ok[b.kind]);
}
