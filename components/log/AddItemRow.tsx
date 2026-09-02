"use client";

import { useState, type FormEvent } from "react";
import type { ItemGroup } from "@/lib/types";

interface Props {
  onAdd: (label: string) => Promise<void>;
  disabled?: boolean;
  tone?: ItemGroup;
  label?: string;
}

const DASH: Record<ItemGroup, string> = {
  core: "rounded-[9px] border-input-line",
  extra: "rounded-lg border-violet-400",
  superpower: "rounded-full border-gold-400",
};

/** A quiet "add your own" row that turns into a one-line input. */
export default function AddItemRow({ onAdd, disabled, tone = "core", label = "add your own" }: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return setEditing(false);
    await onAdd(text);
    setText("");
    setEditing(false);
  }

  if (disabled) return null;
  if (!editing) {
    return (
      <button type="button" onClick={() => setEditing(true)} className="flex min-h-11 w-full items-center gap-3 rounded-[14px] px-2.5 text-left text-sm font-medium text-ink-faint">
        <span aria-hidden className={`flex h-6 w-6 items-center justify-center border-[1.5px] border-dashed text-sm ${DASH[tone]}`}>+</span>
        {label}
      </button>
    );
  }
  return (
    <form onSubmit={submit} className="px-2.5 py-1">
      <input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={submit}
        placeholder="new item"
        className="h-11 w-full rounded-[13px] border-[1.5px] border-input-line bg-input px-3 text-[15px] outline-none focus:border-pink-300"
      />
    </form>
  );
}
