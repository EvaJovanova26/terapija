import { addDays } from "./date";
import type { EntryDraft, Item } from "./types";

/**
 * All point and unlock rules live here. Tune freely.
 * Points are additive only: nothing here ever subtracts.
 */

/** A day following a zero-point day counts double. The bad weeks are where the points are. */
export const REBOUND_MULTIPLIER = 2;

export type PlantKind =
  | "sprout" | "clover" | "tulips" | "fern" | "lavender"
  | "berry" | "sunflower" | "sapling" | "apple" | "willow";

export interface PlantDef {
  kind: PlantKind;
  name: string;
  threshold: number;
  /** Scene placement on a 390×250 canvas: left, bottom, width in px. */
  x: number;
  y: number;
  w: number;
}

/** Plot one. The sprout is there from the first point so the garden is never empty. */
export const PLOT_ONE: PlantDef[] = [
  { kind: "sprout", name: "sprout", threshold: 0, x: 52, y: 6, w: 44 },
  { kind: "clover", name: "clover", threshold: 60, x: 100, y: 2, w: 40 },
  { kind: "tulips", name: "tulips", threshold: 150, x: 216, y: 4, w: 50 },
  { kind: "fern", name: "fern", threshold: 300, x: 270, y: 2, w: 44 },
  { kind: "lavender", name: "lavender", threshold: 500, x: 314, y: 6, w: 40 },
  { kind: "berry", name: "berry bush", threshold: 750, x: 352, y: 0, w: 38 },
  { kind: "sunflower", name: "sunflower", threshold: 1050, x: 30, y: 62, w: 48 },
  { kind: "sapling", name: "sapling", threshold: 1400, x: 84, y: 62, w: 50 },
  { kind: "apple", name: "apple tree", threshold: 1800, x: 228, y: 62, w: 72 },
  { kind: "willow", name: "willow", threshold: 2250, x: 306, y: 58, w: 76 },
];

/** Plot two opens when plot one is full and repeats the same ten shapes at higher thresholds. */
export const PLOT_TWO_THRESHOLDS = [2250, 2800, 3400, 4050, 4750, 5500, 6300, 7150, 8050, 9000];
export const PLOT_TWO: PlantDef[] = PLOT_ONE.map((p, i) => ({ ...p, threshold: PLOT_TWO_THRESHOLDS[i] }));

export const PLANTS: PlantDef[] = [...PLOT_ONE, ...PLOT_TWO.slice(1)];

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

export function firstEntryDate(entries: EntryDraft[]): string | null {
  return entries.reduce<string | null>((m, e) => (m === null || e.date < m ? e.date : m), null);
}

/** Sum of multiplied points across every entry. */
export function sumPoints(entries: EntryDraft[], points: PointsById): number {
  const byDate = pointsByDate(entries, points);
  const first = firstEntryDate(entries);
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

/** Which flower drawing to show for a 0–1 progress value. */
export function flowerStage(progress: number): "f-0" | "f-50" | "f-100" {
  return progress < 0.25 ? "f-0" : progress < 0.8 ? "f-50" : "f-100";
}

export function plotOneFull(points: number): boolean {
  return points >= PLOT_ONE[PLOT_ONE.length - 1].threshold;
}
