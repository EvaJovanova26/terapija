"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatLong } from "@/lib/date";
import { itemPoints } from "@/lib/garden-logic";
import { postcards, type Postcard } from "@/lib/grow/postcards";
import { createClient } from "@/lib/supabase/client";
import { fetchAllEntries, fetchItems } from "@/lib/supabase/queries";
import type { Entry } from "@/lib/types";
import PostcardCard from "./PostcardCard";

type View = "notes" | "postcards";

export default function JournalScreen() {
  const [view, setView] = useState<View>("notes");
  const [notes, setNotes] = useState<Entry[] | null>(null);
  const [cards, setCards] = useState<Postcard[]>([]);

  useEffect(() => {
    let cancelled = false;
    const db = createClient();
    Promise.all([fetchAllEntries(db), fetchItems(db)])
      .then(([entries, items]) => {
        if (cancelled) return;
        setNotes(entries.filter((e) => (e.note ?? "").trim()).reverse());
        setCards(postcards(entries, items, itemPoints(items)));
      })
      .catch(() => !cancelled && setNotes([]));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!notes) return <div className="h-40" aria-hidden />;

  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-[28px] font-medium text-ink">Journal</h1>
      <div className="flex gap-1 rounded-2xl bg-accent-soft p-1" role="tablist">
        {(["notes", "postcards"] as View[]).map((v) => (
          <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)} className={`flex-1 rounded-[13px] py-2.5 text-sm font-semibold capitalize ${view === v ? "bg-card text-ink" : "text-ink-soft"}`}>
            {v}
          </button>
        ))}
      </div>
      {view === "notes" &&
        (notes.length === 0 ? (
          <p className="px-1 text-sm text-ink-faint">No notes yet. The note box on any day lands here.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {notes.map((e) => (
              <li key={e.id}>
                <Link href={`/entry/${e.date}`} className="block rounded-[22px] border border-line bg-card p-4">
                  <p className="text-xs font-semibold text-ink-faint">{formatLong(e.date)}</p>
                  <p className="whitespace-pre-wrap pt-1.5 text-[15px] leading-relaxed text-ink">{e.note}</p>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      {view === "postcards" && (
        <div className="flex flex-col gap-3">
          {cards.map((c) => <PostcardCard key={c.month} card={c} />)}
          {cards.length === 0 && <p className="px-1 text-sm text-ink-faint">The first postcard arrives once a month has anything in it.</p>}
        </div>
      )}
    </div>
  );
}
