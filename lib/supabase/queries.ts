import type { Entry, EntryDraft, GardenState, Item, Profile } from "../types";
import type { Db } from "./client";

function fail(context: string, error: { message: string }): never {
  throw new Error(`${context}: ${error.message}`);
}

/** Guards against rows from a database that has not run migration 002 yet. */
function normalize(e: Entry): Entry {
  return { ...e, done_items: Array.isArray(e.done_items) ? e.done_items : [] };
}

// Entries -----------------------------------------------------------------

export async function fetchEntry(db: Db, date: string): Promise<Entry | null> {
  const { data, error } = await db.from("entries").select("*").eq("date", date).maybeSingle();
  if (error) fail("fetchEntry", error);
  return data ? normalize(data) : null;
}

/** Insert or update the entry for `draft.date`. user_id comes from the DB default. */
export async function upsertEntry(db: Db, draft: EntryDraft): Promise<Entry> {
  const { data, error } = await db
    .from("entries")
    .upsert(draft, { onConflict: "user_id,date" })
    .select("*")
    .single();
  if (error) fail("upsertEntry", error);
  return normalize(data);
}

export async function fetchEntriesBetween(db: Db, start: string, end: string): Promise<Entry[]> {
  const { data, error } = await db
    .from("entries")
    .select("*")
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true });
  if (error) fail("fetchEntriesBetween", error);
  return (data ?? []).map(normalize);
}

export async function fetchAllEntries(db: Db): Promise<Entry[]> {
  const { data, error } = await db.from("entries").select("*").order("date", { ascending: true });
  if (error) fail("fetchAllEntries", error);
  return (data ?? []).map(normalize);
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

// Items -------------------------------------------------------------------

/** All items including retired ones, in display order. Seeds defaults on first use. */
export async function fetchItems(db: Db): Promise<Item[]> {
  const load = () =>
    db.from("items").select("*").order("group_name").order("sort_order").order("created_at");
  let { data, error } = await load();
  if (error) fail("fetchItems", error);
  if (!data || data.length === 0) {
    const seed = await db.rpc("seed_default_items");
    if (seed.error) fail("seed_default_items", seed.error);
    ({ data, error } = await load());
    if (error) fail("fetchItems", error);
  }
  return data ?? [];
}

export async function insertItem(db: Db, item: Pick<Item, "label" | "group_name" | "points" | "sort_order" | "domain" | "traits">): Promise<Item> {
  const { data, error } = await db.from("items").insert(item).select("*").single();
  if (error) fail("insertItem", error);
  return data;
}

export async function updateItem(db: Db, id: string, patch: Partial<Item>): Promise<Item> {
  const { data, error } = await db.from("items").update(patch).eq("id", id).select("*").single();
  if (error) fail("updateItem", error);
  return data;
}

export async function deleteItem(db: Db, id: string): Promise<void> {
  const { error } = await db.from("items").delete().eq("id", id);
  if (error) fail("deleteItem", error);
}

/** Persists a new order: position in `ids` becomes sort_order. */
export async function saveItemOrder(db: Db, ids: string[]): Promise<void> {
  const results = await Promise.all(ids.map((id, i) => db.from("items").update({ sort_order: i + 1 }).eq("id", id)));
  const bad = results.find((r) => r.error);
  if (bad?.error) fail("saveItemOrder", bad.error);
}

// Profile -----------------------------------------------------------------

export async function fetchProfile(db: Db): Promise<Profile | null> {
  const { data, error } = await db.from("profiles").select("*").maybeSingle();
  if (error) fail("fetchProfile", error);
  return data ?? null;
}

export async function saveProfile(db: Db, patch: Pick<Profile, "avatar"> & Partial<Pick<Profile, "display_name">>): Promise<void> {
  const { error } = await db.from("profiles").upsert(patch, { onConflict: "user_id" });
  if (error) fail("saveProfile", error);
}

// Garden ------------------------------------------------------------------

export async function fetchGardenState(db: Db): Promise<GardenState | null> {
  const { data, error } = await db.from("garden_state").select("*").maybeSingle();
  if (error) fail("fetchGardenState", error);
  return data ?? null;
}

/** Records a new lifetime total. Callers only pass values >= the stored one. */
export async function saveLifetimePoints(db: Db, points: number): Promise<void> {
  const { error } = await db.from("garden_state").upsert({ lifetime_points: points }, { onConflict: "user_id" });
  if (error) fail("saveLifetimePoints", error);
}
