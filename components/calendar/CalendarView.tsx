"use client";

import { useEffect, useState } from "react";
import { addMonths, monthEnd, monthKey, monthStart, todayLocal } from "@/lib/date";
import { createClient } from "@/lib/supabase/client";
import { fetchEntriesBetween, fetchFirstEntryDate } from "@/lib/supabase/queries";
import type { Entry } from "@/lib/types";
import Sym, { VB } from "@/components/art/Sym";
import MonthGrid from "./MonthGrid";
import MonthNav from "./MonthNav";

export default function CalendarView() {
  const [today, setToday] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [firstEntry, setFirstEntry] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const t = todayLocal();
    setToday(t);
    setMonth(monthStart(t));
    fetchFirstEntryDate(createClient()).then(setFirstEntry).catch(() => {});
  }, []);

  useEffect(() => {
    if (!month) return;
    let cancelled = false;
    fetchEntriesBetween(createClient(), monthStart(month), monthEnd(month))
      .then((rows) => !cancelled && setEntries(rows))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [month]);

  if (!month || !today) return <div className="h-40" aria-hidden />;

  const earliest = firstEntry ? monthKey(firstEntry) : monthKey(today);
  const canBack = monthKey(month) > earliest;
  const canForward = monthKey(month) < monthKey(today);

  return (
    <div className="flex flex-col gap-4 px-1">
      <MonthNav month={month} canBack={canBack} canForward={canForward} onBack={() => setMonth(addMonths(month, -1))} onForward={() => setMonth(addMonths(month, 1))} />
      <MonthGrid month={month} entries={entries} today={today} />
      <div className="flex items-center gap-4 pt-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-soft"><Sym id="f-100" vb={VB.flower} width={16} /> logged</span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-faint"><Sym id="f-0" vb={VB.flower} width={16} opacity={0.22} /> not logged</span>
      </div>
      <p className="text-[13px] text-ink-faint">Tap a day to open it.</p>
      <div className="flex items-end justify-between pt-3 opacity-90">
        <Sym id="d-mushrooms" vb={VB.mushrooms} width={76} />
        <Sym id="d-butterfly" vb={VB.small} width={34} />
        <Sym id="d-sprig" vb={VB.sprig} width={70} />
      </div>
    </div>
  );
}
