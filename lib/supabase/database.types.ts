import type { Entry, GardenState } from "../types";

type EntryInsert = Partial<Entry> & Pick<Entry, "date">;
type GardenInsert = Partial<GardenState>;

/** Minimal hand-written schema type mirroring supabase/schema.sql. */
export interface Database {
  public: {
    Tables: {
      entries: {
        Row: Entry;
        Insert: EntryInsert;
        Update: Partial<Entry>;
        Relationships: [];
      };
      garden_state: {
        Row: GardenState;
        Insert: GardenInsert;
        Update: Partial<GardenState>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
