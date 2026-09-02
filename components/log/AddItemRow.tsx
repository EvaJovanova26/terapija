"use client";

import { useState, type FormEvent } from "react";

interface Props {
  onAdd: (label: string) => Promise<void>;
  disabled?: boolean;
}

/** A quiet "add your own" row that turns into a one-line input. */
export default function AddItemRow({ onAdd, disabled }: Props) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!label.trim()) return setEditing(false);
    await onAdd(label);
    setLabel("");
    setEditing(false);
  }

  if (disabled) return null;
  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex min-h-11 w-full items-center gap-2 rounded-xl px-4 text-left text-sm text-ink-faint active:bg-moss-100"
      >
        <span aria-hidden>+</span> add your own
      </button>
    );
  }
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        autoFocus
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={submit}
        placeholder="new item"
        className="h-12 flex-1 rounded-xl border border-line bg-card px-3 text-base outline-none focus:border-moss-500"
      />
    </form>
  );
}
