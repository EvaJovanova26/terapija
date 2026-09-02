import { CORE_FIELDS, UPSIDE_FIELDS, type EntryDraft } from "./types";

/**
 * All point and unlock rules live here. Tune freely.
 * Points are additive only: nothing here ever subtracts.
 */
export const POINTS_PER_CORE = 1;
export const POINTS_PER_UPSIDE = 2;

export type PlantKind =
  | "sprout"
  | "clover"
  | "tulip"
  | "fern"
  | "lavender"
  | "bush"
  | "sunflower"
  | "sapling"
  | "tree"
  | "willow";

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

/** Points earned by a single day's entry. Never negative. */
export function pointsForEntry(entry: EntryDraft): number {
  const core = CORE_FIELDS.filter((f) => entry[f]).length * POINTS_PER_CORE;
  const upside = UPSIDE_FIELDS.filter((f) => entry[f]).length * POINTS_PER_UPSIDE;
  return core + upside;
}

/** Sum of points across every entry. */
export function sumPoints(entries: EntryDraft[]): number {
  return entries.reduce((total, e) => total + pointsForEntry(e), 0);
}

/**
 * The number to display. `storedHighWater` is the lifetime total previously
 * recorded; the result is never lower than it, so edits to old days can only
 * add, never take away.
 */
export function lifetimePoints(entries: EntryDraft[], storedHighWater: number): number {
  return Math.max(sumPoints(entries), storedHighWater, 0);
}

export function unlockedPlants(points: number): PlantDef[] {
  return PLANTS.filter((p) => p.threshold <= points);
}

export function nextPlant(points: number): PlantDef | null {
  return PLANTS.find((p) => p.threshold > points) ?? null;
}
