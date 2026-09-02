"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatLong } from "@/lib/date";
import { createClient } from "@/lib/supabase/client";
import { fetchAllEntries } from "@/lib/supabase/queries";
import type { Entry } from "@/lib/types";

/** Every note, newest first, like reading back through a diary. */
export default function NotesList() {
  const [notes, setNotes] = useState<Entry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAllEntries(createClient())
      .then((rows) => !cancelled && setNotes(rows.filter((e) => (e.note ?? "").trim()).reverse()))
      .catch(() => !cancelled && setNotes([]));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!notes) return <div className="h-40" aria-hidden />;
  if (notes.length === 0) return <p className="px-1 text-sm text-ink-faint">No notes yet. The note box on any day lands here.</p>;

  return (
    <ul className="flex flex-col gap-3">
      {notes.map((e) => (
        <li key={e.id}>
          <Link href={`/entry/${e.date}`} className="block rounded-[22px] border border-line bg-card p-4 active:bg-pink-100">
            <p className="text-xs font-semibold text-ink-faint">{formatLong(e.date)}</p>
            <p className="whitespace-pre-wrap pt-1.5 text-[15px] leading-relaxed text-ink">{e.note}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
