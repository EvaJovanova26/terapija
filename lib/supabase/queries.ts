import type { Entry, EntryDraft, GardenState } from "../types";
import type { Db } from "./client";

function fail(context: string, error: { message: string }): never {
  throw new Error(`${context}: ${error.message}`);
}

export async function fetchEntry(db: Db, date: string): Promise<Entry | null> {
  const { data, error } = await db
    .from("entries")
    .select("*")
    .eq("date", date)
    .maybeSingle();
  if (error) fail("fetchEntry", error);
  return data ?? null;
}

/** Insert or update the entry for `draft.date`. user_id comes from the DB default (auth.uid()). */
export async function upsertEntry(db: Db, draft: EntryDraft): Promise<Entry> {
  const { data, error } = await db
    .from("entries")
    .upsert(draft, { onConflict: "user_id,date" })
    .select("*")
    .single();
  if (error) fail("upsertEntry", error);
  return data;
}

export async function fetchEntriesBetween(
  db: Db,
  start: string,
  end: string,
): Promise<Entry[]> {
  const { data, error } = await db
    .from("entries")
    .select("*")
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true });
  if (error) fail("fetchEntriesBetween", error);
  return data ?? [];
}

export async function fetchAllEntries(db: Db): Promise<Entry[]> {
  const { data, error } = await db
    .from("entries")
    .select("*")
    .order("date", { ascending: true });
  if (error) fail("fetchAllEntries", error);
  return data ?? [];
}

export async function fetchFirstEntryDate(db: Db): Promise<string | null> {
  const { data, error } = await db
    .from("entries")
    .select("date")
    .order("date", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) fail("fetchFirstEntryDate", error);
  return data?.date ?? null;
}

export async function fetchGardenState(db: Db): Promise<GardenState | null> {
  const { data, error } = await db.from("garden_state").select("*").maybeSingle();
  if (error) fail("fetchGardenState", error);
  return data ?? null;
}

/** Records a new lifetime total. Callers only pass values >= the stored one. */
export async function saveLifetimePoints(db: Db, points: number): Promise<void> {
  const { error } = await db
    .from("garden_state")
    .upsert({ lifetime_points: points }, { onConflict: "user_id" });
  if (error) fail("saveLifetimePoints", error);
}
