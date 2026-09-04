import type { Domain, EntryDraft, Item } from "../types";

/** Rooms, in the order they appear on the Home tab. Tune freely. */
export interface RoomDef {
  domain: Domain;
  name: string;
  /** What the room is fed by, in plain words. */
  fedBy: string;
}

export const ROOMS: RoomDef[] = [
  { domain: "kitchen", name: "Kitchen", fedBy: "eating, water, cooking" },
  { domain: "reading", name: "Reading corner", fedBy: "reading, learning, making, admin" },
  { domain: "bedroom", name: "Bedroom", fedBy: "sleep, bedtimes, rest" },
  { domain: "doorway", name: "Doorway", fedBy: "going out, walks, exercise" },
  { domain: "bathroom", name: "Bathroom", fedBy: "teeth, shower, skincare, meds" },
  { domain: "living", name: "Living room", fedBy: "friends, messages, people" },
];

/** Points needed to reach each level. Level 0 is the bare room. */
export const ROOM_LEVEL_THRESHOLDS = [15, 40, 80, 140, 220];
export const MAX_ROOM_LEVEL = ROOM_LEVEL_THRESHOLDS.length;

export interface RoomState {
  room: RoomDef;
  points: number;
  level: number;
  /** Points to the next level, or null at max. */
  nextAt: number | null;
  /** 0–1 progress within the current level. */
  progress: number;
}

/** Base points accumulated per room across all entries. Never decreases. */
export function roomPoints(entries: EntryDraft[], items: Item[]): Map<Domain, number> {
  const byId = new Map(items.map((i) => [i.id, i]));
  const totals = new Map<Domain, number>(ROOMS.map((r) => [r.domain, 0]));
  for (const e of entries) {
    for (const id of e.done_items) {
      const item = byId.get(id);
      if (item) totals.set(item.domain, (totals.get(item.domain) ?? 0) + item.points);
    }
  }
  return totals;
}

export function levelFor(points: number, thresholds = ROOM_LEVEL_THRESHOLDS): number {
  return thresholds.filter((t) => points >= t).length;
}

export function roomStates(entries: EntryDraft[], items: Item[]): RoomState[] {
  const totals = roomPoints(entries, items);
  return ROOMS.map((room) => {
    const points = totals.get(room.domain) ?? 0;
    const level = levelFor(points);
    const prev = level === 0 ? 0 : ROOM_LEVEL_THRESHOLDS[level - 1];
    const nextAt = level >= MAX_ROOM_LEVEL ? null : ROOM_LEVEL_THRESHOLDS[level];
    const progress = nextAt === null ? 1 : (points - prev) / (nextAt - prev);
    return { room, points, level, nextAt, progress: Math.min(1, Math.max(0, progress)) };
  });
}

/** The room matching the most recently ticked item today, else the living room. */
export function roomForToday(today: EntryDraft | null, items: Item[]): Domain {
  if (!today || today.done_items.length === 0) return "living";
  const last = today.done_items[today.done_items.length - 1];
  return items.find((i) => i.id === last)?.domain ?? "living";
}
