export const ITEM_GROUPS = ["core", "extra", "superpower"] as const;
export type ItemGroup = (typeof ITEM_GROUPS)[number];

export const GROUP_META: Record<ItemGroup, { title: string; hint: string; defaultPoints: number; maxItems: number }> = {
  core: { title: "Core", hint: "The basics. Anything counts.", defaultPoints: 1, maxItems: 16 },
  extra: { title: "Extra", hint: "Bonus only. Never expected.", defaultPoints: 2, maxItems: 24 },
  superpower: { title: "Superpower", hint: "The big ones.", defaultPoints: 5, maxItems: 24 },
};

/** A row in `items`: something the user can tick on a day. */
export type Item = {
  id: string;
  user_id: string;
  label: string;
  group_name: ItemGroup;
  points: number;
  sort_order: number;
  retired_at: string | null;
  created_at: string;
  updated_at: string;
};

export const NUMBER_FIELDS = ["sleep_hours", "gaming_hours", "alcohol_units", "km_walked"] as const;
export type NumberField = (typeof NUMBER_FIELDS)[number];

export const SCALE_FIELDS = ["mood", "energy"] as const;
export type ScaleField = (typeof SCALE_FIELDS)[number];

export const FIELD_LABELS: Record<NumberField | ScaleField | "bedtime", string> = {
  sleep_hours: "Sleep hours",
  gaming_hours: "Gaming hours",
  alcohol_units: "Alcohol units",
  km_walked: "Km walked",
  bedtime: "Bedtime",
  mood: "Mood",
  energy: "Energy",
};

/** A row in `entries`. Numerics are null when not recorded, never zero. */
export type Entry = Record<NumberField, number | null> &
  Record<ScaleField, number | null> & {
    id: string;
    user_id: string;
    /** Local calendar date, YYYY-MM-DD. */
    date: string;
    /** Ids of ticked items. */
    done_items: string[];
    /** "HH:MM" or null. */
    bedtime: string | null;
    note: string | null;
    created_at: string;
    updated_at: string;
  };

/** What the log form edits. */
export type EntryDraft = Omit<Entry, "id" | "user_id" | "created_at" | "updated_at">;

export function emptyDraft(date: string): EntryDraft {
  return {
    date,
    done_items: [],
    sleep_hours: null,
    gaming_hours: null,
    alcohol_units: null,
    km_walked: null,
    bedtime: null,
    mood: null,
    energy: null,
    note: null,
  };
}

export function toDraft(entry: Entry): EntryDraft {
  const { id: _id, user_id: _u, created_at: _c, updated_at: _up, ...draft } = entry;
  return { ...draft, bedtime: draft.bedtime ? draft.bedtime.slice(0, 5) : null };
}

export type GardenState = {
  user_id: string;
  lifetime_points: number;
  updated_at: string;
};
