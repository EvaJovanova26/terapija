"use client";

import { useState } from "react";
import type { Item } from "@/lib/types";

interface Props {
  item: Item;
  onPatch: (changes: Partial<Item>) => Promise<void>;
  onMove: (direction: -1 | 1) => Promise<void>;
}

const small = "h-8 min-w-8 rounded-lg px-2 text-xs font-semibold text-ink-faint active:bg-pink-100 disabled:opacity-30";

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
    <div className={`flex items-center gap-2 px-2 py-1.5 ${retired ? "opacity-50" : ""}`}>
      <div className="flex flex-col">
        <button type="button" className={small} disabled={retired} onClick={() => void onMove(-1)} aria-label="Move up">↑</button>
        <button type="button" className={small} disabled={retired} onClick={() => void onMove(1)} aria-label="Move down">↓</button>
      </div>
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={commitLabel}
        disabled={retired}
        aria-label="Item name"
        className="h-10 min-w-0 flex-1 rounded-lg bg-transparent px-1 text-[15px] font-medium text-ink outline-none focus:bg-input"
      />
      <label className="flex items-center gap-1 text-xs font-semibold text-ink-soft">
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={item.points}
          disabled={retired}
          onChange={(e) => void onPatch({ points: Math.max(0, Number(e.target.value) || 0) })}
          className="h-9 w-12 rounded-[10px] border-[1.5px] border-input-line bg-input text-center text-sm font-semibold text-ink outline-none focus:border-pink-300"
        />
        pt
      </label>
      <button type="button" className={`${small} text-berry`} onClick={() => void onPatch({ retired_at: retired ? null : new Date().toISOString() })}>
        {retired ? "Restore" : "Retire"}
      </button>
    </div>
  );
}
