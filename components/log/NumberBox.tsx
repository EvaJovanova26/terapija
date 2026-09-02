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

export const INPUT = "h-10 rounded-[13px] border-[1.5px] border-input-line bg-input text-center text-[15px] font-semibold text-ink outline-none focus:border-pink-300";

/** Label on the left, a small box on the right, as in the design. */
export default function NumberBox({ label, value, onChange }: Props) {
  // Local text so partial input like "0." survives while typing.
  const [text, setText] = useState(value === null ? "" : String(value));
  useEffect(() => {
    setText((t) => (parseNumber(t) === value ? t : value === null ? "" : String(value)));
  }, [value]);

  return (
    <label className="flex items-center gap-3 py-1.5">
      <span className="flex-1 text-[15px] font-medium text-ink">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        placeholder="—"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(parseNumber(e.target.value));
        }}
        className={`w-[76px] ${INPUT}`}
      />
    </label>
  );
}
