import { addDays, monthStart, todayLocal, weekdayMondayFirst } from "./date";
import { dayPoints, firstEntryDate, pointsByDate, type PointsById } from "./garden-logic";
import type { Entry, Item, NumberField, ScaleField } from "./types";

export type Period = "week" | "month" | "more";

export interface Range {
  start: string;
  end: string;
  days: string[];
}

/** Week = Monday to today's week end; month = calendar month; more = last 12 weeks. */
export function periodRange(period: Period, today = todayLocal()): Range {
  let start: string;
  let end: string;
  if (period === "week") {
    start = addDays(today, -weekdayMondayFirst(today));
    end = addDays(start, 6);
  } else if (period === "month") {
    start = monthStart(today);
    end = addDays(monthStart(addDays(start, 32)), -1);
  } else {
    start = addDays(today, -83);
    end = today;
  }
  const days: string[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);
  return { start, end, days };
}

export function inRange(entries: Entry[], r: Range): Entry[] {
  return entries.filter((e) => e.date >= r.start && e.date <= r.end);
}

/** Total multiplied points in the range, and the average over days that have passed. */
export function periodPoints(all: Entry[], r: Range, points: PointsById, today = todayLocal()) {
  const byDate = pointsByDate(all, points);
  const first = firstEntryDate(all);
  const total = r.days.reduce((s, d) => s + dayPoints(d, byDate, first), 0);
  const elapsed = r.days.filter((d) => d <= today).length || 1;
  return { total, perDay: Math.round(total / elapsed) };
}

/** One value per day in the range; null for days without a recorded value. */
export function series(entries: Entry[], r: Range, field: NumberField | ScaleField): (number | null)[] {
  const byDate = new Map(entries.map((e) => [e.date, e[field]]));
  return r.days.map((d) => byDate.get(d) ?? null);
}

export function average(values: (number | null)[]): number | null {
  const xs = values.filter((v): v is number => v !== null);
  return xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null;
}

export function sum(values: (number | null)[]): number {
  return Math.round(values.reduce<number>((a, b) => a + (b ?? 0), 0) * 10) / 10;
}

export interface ItemCount {
  item: Item;
  days: number;
  ratio: number;
}

/** Days each item was ticked in the range, most first. */
export function itemCounts(entries: Entry[], items: Item[], r: Range, today = todayLocal()): ItemCount[] {
  const elapsed = r.days.filter((d) => d <= today).length || 1;
  const tally = new Map<string, number>();
  for (const e of entries) for (const id of e.done_items) tally.set(id, (tally.get(id) ?? 0) + 1);
  return items
    .map((item) => ({ item, days: tally.get(item.id) ?? 0, ratio: (tally.get(item.id) ?? 0) / elapsed }))
    .filter((c) => c.days > 0)
    .sort((a, b) => b.days - a.days);
}
