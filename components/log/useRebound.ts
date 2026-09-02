"use client";

import { useEffect, useState } from "react";
import { addDays } from "@/lib/date";
import { basePoints, isReboundDay, type PointsById } from "@/lib/garden-logic";
import { createClient } from "@/lib/supabase/client";
import { fetchEntry, fetchFirstEntryDate } from "@/lib/supabase/queries";

/** True when `date` follows a zero-point day, so its points count double. */
export function useRebound(date: string, points: PointsById | null): boolean {
  const [rebound, setRebound] = useState(false);

  useEffect(() => {
    if (!points) return;
    let cancelled = false;
    const db = createClient();
    const yesterday = addDays(date, -1);
    Promise.all([fetchEntry(db, yesterday), fetchFirstEntryDate(db)])
      .then(([entry, first]) => {
        if (cancelled) return;
        const byDate = new Map([[yesterday, entry ? basePoints(entry, points) : 0]]);
        setRebound(isReboundDay(date, byDate, first));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [date, points]);

  return rebound;
}
