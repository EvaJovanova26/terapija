"use client";

import { useEffect, useState, type ReactNode } from "react";

interface Props {
  id: string;
  title: string;
  tag?: string;
  hint?: string;
  tone?: "default" | "soft" | "bright";
  children: ReactNode;
}

const TONES = {
  default: "bg-card",
  soft: "bg-paper border-dashed",
  bright: "bg-sun-100",
};

function readOpen(id: string): boolean {
  try {
    return localStorage.getItem(`blossom.open.${id}`) !== "0";
  } catch {
    return true;
  }
}

/** A card whose body can be tucked away. Remembers its state per device. */
export default function Collapsible({ id, title, tag, hint, tone = "default", children }: Props) {
  const [open, setOpen] = useState(true);
  useEffect(() => setOpen(readOpen(id)), [id]);

  function toggle() {
    const next = !open;
    setOpen(next);
    try {
      localStorage.setItem(`blossom.open.${id}`, next ? "1" : "0");
    } catch {}
  }

  return (
    <section className={`rounded-2xl border border-line ${TONES[tone]}`}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold uppercase tracking-wide text-ink-soft">{title}</span>
        {tag && <span className="rounded-full bg-moss-100 px-2 py-0.5 text-xs text-moss-700">{tag}</span>}
        <span className="flex-1" />
        <svg viewBox="0 0 16 16" className={`h-4 w-4 text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4">
          {hint && <p className="mb-3 text-sm text-ink-faint">{hint}</p>}
          {children}
        </div>
      )}
    </section>
  );
}
