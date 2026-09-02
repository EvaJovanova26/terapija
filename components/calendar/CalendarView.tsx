"use client";

import { useEffect, useState } from "react";
import { addMonths, monthEnd, monthKey, monthStart, todayLocal } from "@/lib/date";
import { createClient } from "@/lib/supabase/client";
import { fetchEntriesBetween, fetchFirstEntryDate } from "@/lib/supabase/queries";
import type { Entry } from "@/lib/types";
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
    <div className="flex flex-col gap-4">
      <MonthNav
        month={month}
        canBack={canBack}
        canForward={canForward}
        onBack={() => setMonth(addMonths(month, -1))}
        onForward={() => setMonth(addMonths(month, 1))}
      />
      <MonthGrid month={month} entries={entries} today={today} />
      <p className="text-sm text-ink-faint">Tap a day to view or fill it in. Any day, any time.</p>
    </div>
  );
}
