import { addDays, monthKey, monthStart } from "../date";
import { dayPoints, firstEntryDate, pointsByDate, type PointsById } from "../garden-logic";
import type { Entry, Item } from "../types";

/** The facts on the back of one month's postcard. */
export interface Postcard {
  month: string; // YYYY-MM
  daysLogged: number;
  points: number;
  topItem: string | null;
  longestRun: number;
  noteLine: string | null;
  /** Number of superpowers ticked that month. */
  superpowers: number;
}

function firstSentence(text: string): string {
  const clean = text.trim().replace(/\s+/g, " ");
  const cut = clean.search(/[.!?]\s|$/);
  const line = clean.slice(0, cut > 0 ? cut + 1 : clean.length);
  return line.length > 120 ? line.slice(0, 117) + "…" : line;
}

/** One postcard per month that has any entry, newest first. */
export function postcards(entries: Entry[], items: Item[], points: PointsById): Postcard[] {
  const byMonth = new Map<string, Entry[]>();
  for (const e of entries) {
    const k = monthKey(e.date);
    byMonth.set(k, [...(byMonth.get(k) ?? []), e]);
  }
  const byDate = pointsByDate(entries, points);
  const first = firstEntryDate(entries);
  const label = new Map(items.map((i) => [i.id, i.label]));
  const supers = new Set(items.filter((i) => i.group_name === "superpower").map((i) => i.id));

  return [...byMonth.keys()].sort().reverse().map((month) => {
    const rows = byMonth.get(month)!;
    const tally = new Map<string, number>();
    let superpowers = 0;
    for (const e of rows) for (const id of e.done_items) {
      tally.set(id, (tally.get(id) ?? 0) + 1);
      if (supers.has(id)) superpowers += 1;
    }
    const top = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
    const logged = rows.filter((e) => (byDate.get(e.date) ?? 0) > 0).map((e) => e.date).sort();
    let run = 0, best = 0, prev: string | null = null;
    for (const d of logged) { run = prev && addDays(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; }
    const start = monthStart(month + "-01");
    let pts = 0;
    for (let d = start; monthKey(d) === month; d = addDays(d, 1)) pts += dayPoints(d, byDate, first);
    const noted = rows.filter((e) => (e.note ?? "").trim());
    return {
      month,
      daysLogged: logged.length,
      points: pts,
      topItem: top ? (label.get(top[0]) ?? null) : null,
      longestRun: best,
      noteLine: noted.length ? firstSentence(noted[noted.length - 1].note!) : null,
      superpowers,
    };
  });
}
