"use client";

import { useState, type HTMLAttributes } from "react";
import type { Item } from "@/lib/types";

interface Props {
  item: Item;
  open: boolean;
  dragging: boolean;
  onOpen: () => void;
  onPatch: (changes: Partial<Item>) => Promise<void>;
  onDelete: () => Promise<void>;
  handle: HTMLAttributes<HTMLElement>;
  rowRef: (el: HTMLElement | null) => void;
}

const btn = "h-10 rounded-[12px] px-3 text-sm font-semibold active:bg-pink-100";

/** One item. Tap to open its editor; drag the handle to move it. */
export default function ItemRow({ item, open, dragging, onOpen, onPatch, onDelete, handle, rowRef }: Props) {
  const [label, setLabel] = useState(item.label);
  const retired = item.retired_at !== null;

  function commitLabel() {
    const trimmed = label.trim();
    if (trimmed && trimmed !== item.label) void onPatch({ label: trimmed });
    else setLabel(item.label);
  }

  async function confirmDelete() {
    if (window.confirm(`Delete "${item.label}" for good? Retire keeps its history instead.`)) await onDelete();
  }

  return (
    <div ref={rowRef} className={`rounded-[14px] transition-colors ${dragging ? "bg-pink-100 shadow-md" : ""} ${retired ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-2 py-1 pr-2">
        <span {...handle} aria-label="Drag to reorder" className="flex h-11 w-9 shrink-0 cursor-grab select-none items-center justify-center text-lg text-[#C79AE0]">
          ⋮⋮
        </span>
        <button type="button" onClick={onOpen} className="flex min-h-11 flex-1 items-center gap-2 text-left">
          <span className="flex-1 text-[15px] font-medium text-ink">{item.label}</span>
          <span className="text-xs font-semibold text-ink-faint">{item.points} pt</span>
          <span className="text-ink-faint">{open ? "⌃" : "›"}</span>
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-2 px-2 pb-3 pl-11">
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink-soft">
            Name
            <input value={label} onChange={(e) => setLabel(e.target.value)} onBlur={commitLabel} className="h-11 rounded-[13px] border-[1.5px] border-input-line bg-input px-3 text-[15px] font-medium text-ink outline-none focus:border-pink-300" />
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-ink-soft">
            Points
            <input type="number" min={0} inputMode="numeric" value={item.points} onChange={(e) => void onPatch({ points: Math.max(0, Number(e.target.value) || 0) })} className="h-10 w-16 rounded-[12px] border-[1.5px] border-input-line bg-input text-center text-[15px] font-semibold text-ink outline-none focus:border-pink-300" />
          </label>
          <div className="flex gap-1 pt-1">
            <button type="button" className={`${btn} text-ink-soft`} onClick={() => void onPatch({ retired_at: retired ? null : new Date().toISOString() })}>
              {retired ? "Restore" : "Retire"}
            </button>
            <button type="button" className={`${btn} text-berry`} onClick={() => void confirmDelete()}>Delete</button>
          </div>
          <p className="text-xs text-ink-faint">Retire hides it but keeps past days. Delete removes it for good.</p>
        </div>
      )}
    </div>
  );
}
