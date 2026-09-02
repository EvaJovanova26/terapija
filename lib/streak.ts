import { addDays } from "./date";

/**
 * Consecutive days with points, counting back from today. If today has no
 * points yet, the run through yesterday still counts, so the number does
 * not drop to zero just because the day isn't over.
 */
export function currentStreak(byDate: Map<string, number>, today: string): number {
  let cursor = (byDate.get(today) ?? 0) > 0 ? today : addDays(today, -1);
  let run = 0;
  while ((byDate.get(cursor) ?? 0) > 0) {
    run += 1;
    cursor = addDays(cursor, -1);
  }
  return run;
}

/** The longest run of consecutive days with points, ever. Never decreases. */
export function longestStreak(byDate: Map<string, number>): number {
  const dates = [...byDate.keys()].filter((d) => (byDate.get(d) ?? 0) > 0).sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of dates) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}
