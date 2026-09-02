"use client";

import { useEffect, useState } from "react";

/** Parses free text into a number or null. Blank means "not recorded", not zero. */
export function parseNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(",", ".");
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

interface Props {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}

export default function NumberBox({ label, value, onChange }: Props) {
  // Local text so partial input like "0." survives while typing.
  const [text, setText] = useState(value === null ? "" : String(value));
  useEffect(() => {
    setText((t) => (parseNumber(t) === value ? t : value === null ? "" : String(value)));
  }, [value]);

  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-ink-soft">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        placeholder="—"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(parseNumber(e.target.value));
        }}
        className="h-12 w-full rounded-xl border border-line bg-card px-3 text-base outline-none focus:border-moss-500"
      />
    </label>
  );
}
