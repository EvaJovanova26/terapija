import { addDays } from "./date";
import type { EntryDraft, Item } from "./types";

/**
 * All point and unlock rules live here. Tune freely.
 * Points are additive only: nothing here ever subtracts.
 */

/** A day following a zero-point day counts double. The bad weeks are where the points are. */
export const REBOUND_MULTIPLIER = 2;

export type PlantKind =
  | "sprout" | "clover" | "tulip" | "fern" | "lavender"
  | "bush" | "sunflower" | "sapling" | "tree" | "willow";

export interface PlantDef {
  kind: PlantKind;
  name: string;
  threshold: number;
  /** Horizontal position in the scene, 0–100. */
  x: number;
}

export const PLANTS: PlantDef[] = [
  { kind: "sprout", name: "First sprout", threshold: 10, x: 50 },
  { kind: "clover", name: "Clover patch", threshold: 25, x: 22 },
  { kind: "tulip", name: "Tulips", threshold: 50, x: 72 },
  { kind: "fern", name: "Fern", threshold: 100, x: 36 },
  { kind: "lavender", name: "Lavender", threshold: 175, x: 86 },
  { kind: "bush", name: "Berry bush", threshold: 275, x: 10 },
  { kind: "sunflower", name: "Sunflower", threshold: 400, x: 62 },
  { kind: "sapling", name: "Sapling", threshold: 550, x: 28 },
  { kind: "tree", name: "Apple tree", threshold: 750, x: 80 },
  { kind: "willow", name: "Willow", threshold: 1000, x: 48 },
];

export type PointsById = Map<string, number>;

export function itemPoints(items: Item[]): PointsById {
  return new Map(items.map((i) => [i.id, i.points]));
}

/** Base points for one day, before any multiplier. Never negative. */
export function basePoints(entry: EntryDraft, points: PointsById): number {
  return entry.done_items.reduce((sum, id) => sum + (points.get(id) ?? 0), 0);
}

/** Base points keyed by date for every entry. */
export function pointsByDate(entries: EntryDraft[], points: PointsById): Map<string, number> {
  return new Map(entries.map((e) => [e.date, basePoints(e, points)]));
}

/** True when the day before `date` earned nothing and `date` is not the first day ever. */
export function isReboundDay(date: string, byDate: Map<string, number>, firstDate: string | null): boolean {
  if (!firstDate || date <= firstDate) return false;
  return (byDate.get(addDays(date, -1)) ?? 0) === 0;
}

/** Points for one day with the rebound multiplier applied. */
export function dayPoints(date: string, byDate: Map<string, number>, firstDate: string | null): number {
  const base = byDate.get(date) ?? 0;
  return isReboundDay(date, byDate, firstDate) ? base * REBOUND_MULTIPLIER : base;
}

/** Sum of multiplied points across every entry. */
export function sumPoints(entries: EntryDraft[], points: PointsById): number {
  const byDate = pointsByDate(entries, points);
  const first = entries.reduce<string | null>((m, e) => (m === null || e.date < m ? e.date : m), null);
  let total = 0;
  for (const date of byDate.keys()) total += dayPoints(date, byDate, first);
  return total;
}

/** The number to display. Never lower than the stored high-water mark. */
export function lifetimePoints(entries: EntryDraft[], points: PointsById, storedHighWater: number): number {
  return Math.max(sumPoints(entries, points), storedHighWater, 0);
}

export function unlockedPlants(points: number): PlantDef[] {
  return PLANTS.filter((p) => p.threshold <= points);
}

export function nextPlant(points: number): PlantDef | null {
  return PLANTS.find((p) => p.threshold > points) ?? null;
}

/** 0–1 progress from the last unlock to the next one. 1 when everything is unlocked. */
export function progressToNext(points: number): number {
  const next = nextPlant(points);
  if (!next) return 1;
  const prev = [...PLANTS].reverse().find((p) => p.threshold <= points)?.threshold ?? 0;
  return Math.min(1, Math.max(0, (points - prev) / (next.threshold - prev)));
}
