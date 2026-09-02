"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { FIELD_LABELS, NUMBER_FIELDS, type EntryDraft, type NumberField } from "@/lib/types";

interface Props {
  draft: EntryDraft;
  onChange: (patch: Partial<EntryDraft>) => void;
}

/** Parses free text into a number or null. Blank means "not recorded", not zero. */
function parse(raw: string): number | null {
  const trimmed = raw.trim().replace(",", ".");
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function NumberBox({
  field,
  value,
  onChange,
}: {
  field: NumberField;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  // Local text so partial input like "0." survives while typing.
  const [text, setText] = useState(value === null ? "" : String(value));
  useEffect(() => {
    setText((t) => (parse(t) === value ? t : value === null ? "" : String(value)));
  }, [value]);

  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-ink-soft">{FIELD_LABELS[field]}</span>
      <input
        type="text"
        inputMode="decimal"
        placeholder="—"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(parse(e.target.value));
        }}
        className="h-12 w-full rounded-xl border border-line bg-card px-3 text-base outline-none focus:border-moss-500"
      />
    </label>
  );
}

export default function NumberInputs({ draft, onChange }: Props) {
  const context = [draft.slept && "slept", draft.left_house && "left the house"].filter(Boolean);
  return (
    <Card title="Numbers" hint="Optional context. Blank is fine.">
      <div className="grid grid-cols-3 gap-2">
        {NUMBER_FIELDS.map((field) => (
          <NumberBox key={field} field={field} value={draft[field]} onChange={(v) => onChange({ [field]: v })} />
        ))}
      </div>
      {context.length > 0 && <p className="mt-3 text-sm text-ink-faint">Also today: {context.join(", ")}.</p>}
    </Card>
  );
}
