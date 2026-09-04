import type { Entry, GardenState, Item, Profile } from "../types";

/** Minimal hand-written schema type mirroring supabase/schema.sql. */
export interface Database {
  public: {
    Tables: {
      entries: {
        Row: Entry;
        Insert: Partial<Entry> & Pick<Entry, "date">;
        Update: Partial<Entry>;
        Relationships: [];
      };
      items: {
        Row: Item;
        Insert: Partial<Item> & Pick<Item, "label" | "group_name">;
        Update: Partial<Item>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
        Relationships: [];
      };
      garden_state: {
        Row: GardenState;
        Insert: Partial<GardenState>;
        Update: Partial<GardenState>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      seed_default_items: { Args: { target?: string }; Returns: undefined };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
