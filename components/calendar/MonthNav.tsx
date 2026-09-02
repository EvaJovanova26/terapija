"use client";

import { formatMonth } from "@/lib/date";

interface Props {
  month: string;
  canBack: boolean;
  canForward: boolean;
  onBack: () => void;
  onForward: () => void;
}

const round =
  "flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-base text-ink-soft active:bg-pink-100 disabled:opacity-25";

export default function MonthNav({ month, canBack, canForward, onBack, onForward }: Props) {
  return (
    <div className="flex items-center justify-between py-1">
      <button type="button" className={round} onClick={onBack} disabled={!canBack} aria-label="Previous month">‹</button>
      <h1 className="font-display text-[23px] font-semibold text-ink">{formatMonth(month)}</h1>
      <button type="button" className={round} onClick={onForward} disabled={!canForward} aria-label="Next month">›</button>
    </div>
  );
}
