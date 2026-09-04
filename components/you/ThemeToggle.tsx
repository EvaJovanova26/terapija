"use client";

import { useEffect, useState } from "react";
import { readThemeMode, saveThemeMode, type ThemeMode } from "@/lib/grow/theme";

const OPTIONS: { key: ThemeMode; label: string }[] = [
  { key: "auto", label: "Follow the clock" },
  { key: "day", label: "Always day" },
  { key: "evening", label: "Always evening" },
];

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("auto");
  useEffect(() => setMode(readThemeMode()), []);

  function pick(m: ThemeMode) {
    setMode(m);
    saveThemeMode(m);
    window.dispatchEvent(new Event("grow:theme"));
  }

  return (
    <div className="flex gap-1 rounded-2xl bg-accent-soft p-1" role="radiogroup" aria-label="Theme">
      {OPTIONS.map((o) => (
        <button key={o.key} type="button" role="radio" aria-checked={mode === o.key} onClick={() => pick(o.key)} className={`flex-1 rounded-[13px] py-2 text-xs font-semibold ${mode === o.key ? "bg-card text-ink" : "text-ink-soft"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
