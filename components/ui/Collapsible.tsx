"use client";

import { useEffect, useState, type ReactNode } from "react";

export type Tone = "core" | "extra" | "superpower" | "plain";

interface Props {
  id: string;
  title: string;
  tag?: string;
  tone?: Tone;
  icon?: ReactNode;
  /** Small control shown in the header, e.g. an edit link. */
  action?: ReactNode;
  children: ReactNode;
}

const CARD: Record<Tone, string> = {
  core: "bg-card border-line",
  extra: "bg-violet-100 border-violet-300",
  superpower: "bg-gold-100 border-gold-300 shadow-[0_6px_18px_-12px_rgba(178,132,20,.45)]",
  plain: "bg-card border-line",
};
const TITLE: Record<Tone, string> = {
  core: "text-ink",
  extra: "text-violet-deep",
  superpower: "text-gold-ink font-bold",
  plain: "text-ink",
};
const TAG: Record<Tone, string> = {
  core: "bg-pink-100 text-berry",
  extra: "bg-violet-200 text-violet-ink",
  superpower: "bg-gold-200 text-gold-ink",
  plain: "bg-[#fde7f3] text-ink-faint",
};

function readOpen(id: string): boolean {
  try {
    return localStorage.getItem(`blossom.open.${id}`) !== "0";
  } catch {
    return true;
  }
}

/** A storybook card whose body can be tucked away. Remembers its state per device. */
export default function Collapsible({ id, title, tag, tone = "plain", icon, action, children }: Props) {
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
    <section className={`rounded-[22px] border p-1.5 ${CARD[tone]}`}>
      <div className="flex items-center gap-2 pr-1">
        <button type="button" onClick={toggle} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-3 text-left">
          {icon}
          <span className={`flex-1 font-display text-lg font-semibold leading-none ${TITLE[tone]}`}>{title}</span>
          {tag && <span className={`rounded-full px-2.5 py-1.5 text-[11px] font-bold leading-none ${TAG[tone]}`}>{tag}</span>}
          <svg viewBox="0 0 16 16" className={`h-4 w-4 text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {action}
      </div>
      {open && <div className="px-0.5 pb-1">{children}</div>}
    </section>
  );
}
