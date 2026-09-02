"use client";

import type { ItemGroup } from "@/lib/types";

interface Props {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  tone?: ItemGroup;
}

const ON: Record<ItemGroup, string> = {
  core: "bg-moss-500 border-moss-500 text-white",
  extra: "bg-moss-100 border-moss-300 text-moss-700",
  superpower: "bg-sun-300 border-sun-500 text-ink",
};

/** Large, one-thumb tap target. Off is a neutral outline — never a warning. */
export default function Toggle({ label, checked, onChange, tone = "core" }: Props) {
  const off = "bg-card border-line text-ink";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 text-left text-base transition-colors ${checked ? ON[tone] : off}`}
    >
      <span
        aria-hidden
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          checked ? "border-current/50 bg-white/30" : "border-line"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3.5 8.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="flex-1">{label}</span>
      {tone === "superpower" && <span aria-hidden className="text-sun-500">✦</span>}
    </button>
  );
}
