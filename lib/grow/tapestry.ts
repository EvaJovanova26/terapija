import { addDays } from "../date";
import { dayPoints, firstEntryDate, pointsByDate, type PointsById } from "../garden-logic";
import type { EntryDraft, Item } from "../types";

/** One woven row. Rendered by code; the design only supplies colours. */
export interface Row {
  date: string;
  logged: boolean;
  /** 1–5, or null when not recorded. */
  mood: number | null;
  points: number;
  /** thin, mid, thick by points. */
  weight: 0 | 1 | 2;
  /** A superpower was logged that day: gold thread. */
  gold: boolean;
  /** First row of a month, for labels. */
  monthStart: boolean;
}

export const WEIGHT_THRESHOLDS = [5, 15];

export function weightFor(points: number): 0 | 1 | 2 {
  return points >= WEIGHT_THRESHOLDS[1] ? 2 : points >= WEIGHT_THRESHOLDS[0] ? 1 : 0;
}

/** Every day from the first entry to `today`, oldest first. Unlogged days weave an undyed row. */
export function tapestryRows(entries: EntryDraft[], items: Item[], points: PointsById, today: string): Row[] {
  const first = firstEntryDate(entries);
  if (!first) return [];
  const byDate = pointsByDate(entries, points);
  const entryByDate = new Map(entries.map((e) => [e.date, e]));
  const supers = new Set(items.filter((i) => i.group_name === "superpower").map((i) => i.id));
  const rows: Row[] = [];
  for (let d = first; d <= today; d = addDays(d, 1)) {
    const e = entryByDate.get(d) ?? null;
    const pts = dayPoints(d, byDate, first);
    rows.push({
      date: d,
      logged: !!e && (pts > 0 || e.mood !== null || !!e.note),
      mood: e?.mood ?? null,
      points: pts,
      weight: weightFor(pts),
      gold: !!e && e.done_items.some((id) => supers.has(id)),
      monthStart: d.endsWith("-01") || d === first,
    });
  }
  return rows;
}
