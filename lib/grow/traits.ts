import type { EntryDraft, Item, Trait } from "../types";

export interface TraitDef {
  key: Trait;
  name: string;
  /** Plain-words description shown under the level. */
  blurb: string;
}

export const TRAIT_DEFS: TraitDef[] = [
  { key: "strength", name: "Strength", blurb: "movement, training, walks" },
  { key: "curiosity", name: "Curiosity", blurb: "reading, learning, new places" },
  { key: "warmth", name: "Warmth", blurb: "people, messages, company" },
  { key: "courage", name: "Courage", blurb: "the slightly scary things" },
  { key: "care", name: "Care", blurb: "looking after the body" },
  { key: "calm", name: "Calm", blurb: "rest, sleep, switching off" },
  { key: "steadiness", name: "Steadiness", blurb: "routines and rhythms" },
];

/** Points needed for level n. Grows gently so early levels come quickly. */
export function traitThreshold(level: number): number {
  return 6 * level * level;
}

export function traitLevel(points: number): number {
  let level = 0;
  while (points >= traitThreshold(level + 1)) level += 1;
  return level;
}

export interface TraitState {
  trait: TraitDef;
  points: number;
  level: number;
  nextAt: number;
  progress: number;
}

/** Points per trait across all entries. An item can feed several traits. */
export function traitPoints(entries: EntryDraft[], items: Item[]): Map<Trait, number> {
  const byId = new Map(items.map((i) => [i.id, i]));
  const totals = new Map<Trait, number>(TRAIT_DEFS.map((t) => [t.key, 0]));
  for (const e of entries) {
    for (const id of e.done_items) {
      const item = byId.get(id);
      if (!item) continue;
      for (const t of item.traits) totals.set(t, (totals.get(t) ?? 0) + item.points);
    }
  }
  return totals;
}

export function traitStates(entries: EntryDraft[], items: Item[]): TraitState[] {
  const totals = traitPoints(entries, items);
  return TRAIT_DEFS.map((trait) => {
    const points = totals.get(trait.key) ?? 0;
    const level = traitLevel(points);
    const prev = traitThreshold(level);
    const nextAt = traitThreshold(level + 1);
    return { trait, points, level, nextAt, progress: (points - prev) / (nextAt - prev) };
  });
}

/** Growth stage from the sum of trait levels. Names match the design sheet. */
export const STAGES = ["Beginning", "Blooming", "Thriving", "Radiant"] as const;
export const STAGE_THRESHOLDS = [0, 10, 25, 45];

export function stageFor(states: TraitState[]): (typeof STAGES)[number] {
  const total = states.reduce((s, t) => s + t.level, 0);
  const idx = STAGE_THRESHOLDS.filter((t) => total >= t).length - 1;
  return STAGES[Math.max(0, idx)];
}
