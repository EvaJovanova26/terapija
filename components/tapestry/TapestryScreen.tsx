"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { todayLocal } from "@/lib/date";
import { itemPoints } from "@/lib/garden-logic";
import { tapestryRows, type Row } from "@/lib/grow/tapestry";
import { createClient } from "@/lib/supabase/client";
import { fetchAllEntries, fetchItems } from "@/lib/supabase/queries";
import TapestryRows from "./TapestryRows";

export default function TapestryScreen() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const db = createClient();
    Promise.all([fetchAllEntries(db), fetchItems(db)])
      .then(([entries, items]) => !cancelled && setRows(tapestryRows(entries, items, itemPoints(items), todayLocal())))
      .catch(() => !cancelled && setRows([]));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!rows) return <div className="h-40" aria-hidden />;
  const logged = rows.filter((r) => r.logged).length;

  return (
    <div className="flex flex-col gap-3">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-[28px] font-medium text-ink">Tapestry</h1>
          <p className="text-sm text-ink-soft">One row a day. {rows.length} rows, {logged} coloured.</p>
        </div>
        <Link href="/calendar" className="text-sm font-semibold text-accent">grid view</Link>
      </header>
      {rows.length === 0 ? (
        <p className="text-sm text-ink-faint">The first row appears once you log a day.</p>
      ) : (
        <TapestryRows rows={rows} />
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-ink-faint">
        {[1, 2, 3, 4, 5].map((m) => (
          <span key={m} className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm" style={{ background: `var(--t-mood-${m})` }} /> mood {m}</span>
        ))}
        <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-sage" /> no mood set</span>
        <span className="flex items-center gap-1.5"><span className="h-px w-4 bg-gold" /> superpower</span>
      </div>
      <p className="px-1 text-xs text-ink-faint">Thicker rows are bigger days. Tap any row to open it.</p>
    </div>
  );
}
