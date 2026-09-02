"use client";

import { useState } from "react";
import type { Item } from "@/lib/types";

interface Props {
  item: Item;
  onPatch: (changes: Partial<Item>) => Promise<void>;
  onMove: (direction: -1 | 1) => Promise<void>;
}

const small = "h-9 min-w-9 rounded-lg border border-line bg-card px-2 text-sm text-ink-soft active:bg-moss-100 disabled:opacity-30";

/** One editable item: label, points, order, retire/restore. */
export default function ItemRow({ item, onPatch, onMove }: Props) {
  const [label, setLabel] = useState(item.label);
  const retired = item.retired_at !== null;

  function commitLabel() {
    const trimmed = label.trim();
    if (trimmed && trimmed !== item.label) void onPatch({ label: trimmed });
    else setLabel(item.label);
  }

  return (
    <div className={`flex flex-col gap-2 rounded-xl border border-line bg-card p-2 ${retired ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={commitLabel}
          disabled={retired}
          className="h-10 min-w-0 flex-1 rounded-lg bg-transparent px-2 text-base outline-none focus:bg-paper"
        />
        <label className="flex items-center gap-1 text-sm text-ink-soft">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={item.points}
            disabled={retired}
            onChange={(e) => void onPatch({ points: Math.max(0, Number(e.target.value) || 0) })}
            className="h-10 w-14 rounded-lg border border-line bg-card px-2 text-center text-base outline-none focus:border-moss-500"
          />
          pt
        </label>
      </div>
      <div className="flex gap-2">
        <button type="button" className={small} disabled={retired} onClick={() => void onMove(-1)} aria-label="Move up">↑</button>
        <button type="button" className={small} disabled={retired} onClick={() => void onMove(1)} aria-label="Move down">↓</button>
        <span className="flex-1" />
        <button
          type="button"
          className={small}
          onClick={() => void onPatch({ retired_at: retired ? null : new Date().toISOString() })}
        >
          {retired ? "restore" : "retire"}
        </button>
      </div>
    </div>
  );
}
