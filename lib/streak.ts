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
