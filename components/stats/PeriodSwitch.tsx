"use client";

import type { Period } from "@/lib/stats";

interface Props {
  value: Period;
  onChange: (p: Period) => void;
}

const OPTIONS: { key: Period; label: string }[] = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "more", label: "More" },
];

export default function PeriodSwitch({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 rounded-2xl bg-pink-200 p-1" role="tablist">
      {OPTIONS.map((o) => (
        <button
          key={o.key}
          type="button"
          role="tab"
          aria-selected={value === o.key}
          onClick={() => onChange(o.key)}
          className={`flex-1 rounded-[13px] py-2.5 text-sm font-semibold ${value === o.key ? "bg-card text-ink" : "text-ink-soft"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
