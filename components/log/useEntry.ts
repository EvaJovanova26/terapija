"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchEntry, upsertEntry } from "@/lib/supabase/queries";
import { emptyDraft, toDraft, type EntryDraft } from "@/lib/types";

export type SaveStatus = "loading" | "idle" | "pending" | "saving" | "saved" | "retry";

const DEBOUNCE_MS = 700;

/** Loads one day's entry and autosaves edits with a debounce. */
export function useEntry(date: string) {
  const [draft, setDraft] = useState<EntryDraft>(() => emptyDraft(date));
  const [status, setStatus] = useState<SaveStatus>("loading");
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(draft);
  latest.current = draft;

  useEffect(() => {
    let cancelled = false;
    fetchEntry(createClient(), date)
      .then((entry) => {
        if (cancelled) return;
        setDraft(entry ? toDraft(entry) : emptyDraft(date));
        setStatus("idle");
      })
      .catch(() => {
        if (!cancelled) setStatus("idle");
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  const save = useCallback(async () => {
    setStatus("saving");
    try {
      await upsertEntry(createClient(), latest.current);
      dirty.current = false;
      setStatus("saved");
    } catch {
      setStatus("retry");
    }
  }, []);

  const scheduleSave = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(save, DEBOUNCE_MS);
  }, [save]);

  const update = useCallback(
    (patch: Partial<EntryDraft>) => {
      dirty.current = true;
      setDraft((d) => ({ ...d, ...patch }));
      setStatus("pending");
      scheduleSave();
    },
    [scheduleSave],
  );

  // Flush a pending save if the user leaves quickly.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (dirty.current) void upsertEntry(createClient(), latest.current).catch(() => {});
    };
  }, []);

  return { draft, status, update, retry: save };
}
