"use client";

import { formatMonth } from "@/lib/date";

interface Props {
  month: string;
  canBack: boolean;
  canForward: boolean;
  onBack: () => void;
  onForward: () => void;
}

const arrow =
  "flex h-11 w-11 items-center justify-center rounded-xl text-xl text-ink-soft active:bg-moss-100 disabled:opacity-25";

export default function MonthNav({ month, canBack, canForward, onBack, onForward }: Props) {
  return (
    <div className="flex items-center justify-between">
      <button type="button" className={arrow} onClick={onBack} disabled={!canBack} aria-label="Previous month">
        ‹
      </button>
      <h1 className="text-lg font-semibold">{formatMonth(month)}</h1>
      <button type="button" className={arrow} onClick={onForward} disabled={!canForward} aria-label="Next month">
        ›
      </button>
    </div>
  );
}
