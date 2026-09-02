"use client";

import { useEffect, useState } from "react";
import { todayLocal } from "@/lib/date";
import EntryForm from "./EntryForm";

/**
 * "Today" is decided on the device, not the server, so it follows the user's
 * local clock. Re-checks when the tab regains focus in case midnight passed.
 */
export default function TodayLog() {
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setDate(todayLocal());
    refresh();
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, []);

  if (!date) return <div className="h-40" aria-hidden />;
  return <EntryForm key={date} date={date} />;
}
