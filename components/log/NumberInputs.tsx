"use client";

import Collapsible from "@/components/ui/Collapsible";
import { FIELD_LABELS, NUMBER_FIELDS, SCALE_FIELDS, type EntryDraft } from "@/lib/types";
import NumberBox from "./NumberBox";
import ScalePicker from "./ScalePicker";

interface Props {
  draft: EntryDraft;
  onChange: (patch: Partial<EntryDraft>) => void;
}

/** Context only. No points, no targets, no colour change by value. */
export default function NumberInputs({ draft, onChange }: Props) {
  return (
    <Collapsible id="numbers" title="Numbers" tag="context" hint="Optional. Blank is fine.">
      <div className="grid grid-cols-2 gap-2">
        {NUMBER_FIELDS.map((field) => (
          <NumberBox
            key={field}
            label={FIELD_LABELS[field]}
            value={draft[field]}
            onChange={(v) => onChange({ [field]: v })}
          />
        ))}
        <label className="flex flex-col gap-1">
          <span className="text-sm text-ink-soft">{FIELD_LABELS.bedtime}</span>
          <input
            type="time"
            value={draft.bedtime ?? ""}
            onChange={(e) => onChange({ bedtime: e.target.value || null })}
            className="h-12 w-full rounded-xl border border-line bg-card px-3 text-base outline-none focus:border-moss-500"
          />
        </label>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3">
        {SCALE_FIELDS.map((field) => (
          <ScalePicker
            key={field}
            label={`${FIELD_LABELS[field]} 1–5`}
            value={draft[field]}
            onChange={(v) => onChange({ [field]: v })}
          />
        ))}
      </div>
    </Collapsible>
  );
}
