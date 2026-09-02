export const CORE_FIELDS = [
  "ate",
  "water",
  "teeth",
  "shower",
  "meds",
  "left_house",
  "slept",
] as const;

export const UPSIDE_FIELDS = [
  "exercised",
  "talked_to_someone",
  "cooked",
  "made_something",
] as const;

export const NUMBER_FIELDS = ["sleep_hours", "gaming_hours", "km_walked"] as const;

export type CoreField = (typeof CORE_FIELDS)[number];
export type UpsideField = (typeof UPSIDE_FIELDS)[number];
export type NumberField = (typeof NUMBER_FIELDS)[number];
export type BoolField = CoreField | UpsideField;

export const FIELD_LABELS: Record<BoolField | NumberField, string> = {
  ate: "Ate",
  water: "Water",
  teeth: "Teeth",
  shower: "Shower",
  meds: "Meds",
  left_house: "Left the house",
  slept: "Slept",
  exercised: "Exercised",
  talked_to_someone: "Talked to someone",
  cooked: "Cooked",
  made_something: "Made something",
  sleep_hours: "Sleep hours",
  gaming_hours: "Gaming hours",
  km_walked: "Km walked",
};

/** A row in the `entries` table. Numerics are null when not recorded. */
export type Entry = Record<BoolField, boolean> &
  Record<NumberField, number | null> & {
    id: string;
    user_id: string;
    /** Local calendar date, YYYY-MM-DD. */
    date: string;
    note: string | null;
    created_at: string;
    updated_at: string;
  };

/** What the log form edits: everything the user controls, keyed by date. */
export type EntryDraft = Omit<Entry, "id" | "user_id" | "created_at" | "updated_at">;

export function emptyDraft(date: string): EntryDraft {
  return {
    date,
    ate: false,
    water: false,
    teeth: false,
    shower: false,
    meds: false,
    left_house: false,
    slept: false,
    exercised: false,
    talked_to_someone: false,
    cooked: false,
    made_something: false,
    sleep_hours: null,
    gaming_hours: null,
    km_walked: null,
    note: null,
  };
}

export function toDraft(entry: Entry): EntryDraft {
  const { id: _id, user_id: _u, created_at: _c, updated_at: _up, ...draft } = entry;
  return draft;
}

/** True when the user has recorded anything at all for the day. */
export function hasAnyLog(draft: EntryDraft): boolean {
  return (
    [...CORE_FIELDS, ...UPSIDE_FIELDS].some((f) => draft[f]) ||
    NUMBER_FIELDS.some((f) => draft[f] !== null) ||
    (draft.note ?? "").trim().length > 0
  );
}

export type GardenState = {
  user_id: string;
  lifetime_points: number;
  updated_at: string;
};
