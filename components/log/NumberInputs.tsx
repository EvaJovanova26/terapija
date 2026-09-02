"use client";

import Collapsible from "@/components/ui/Collapsible";
import { FIELD_LABELS, NUMBER_FIELDS, type EntryDraft } from "@/lib/types";
import NumberBox, { INPUT } from "./NumberBox";
import ScalePicker from "./ScalePicker";

interface Props {
  draft: EntryDraft;
  onChange: (patch: Partial<EntryDraft>) => void;
}

/** Context only. No points, no targets, no colour change by value. */
export default function NumberInputs({ draft, onChange }: Props) {
  return (
    <Collapsible id="numbers" title="Numbers" tag="context only">
      <div className="flex flex-col px-2.5 pb-2">
        {NUMBER_FIELDS.map((field) => (
          <NumberBox key={field} label={FIELD_LABELS[field]} value={draft[field]} onChange={(v) => onChange({ [field]: v })} />
        ))}
        <label className="flex items-center gap-3 py-1.5">
          <span className="flex-1 text-[15px] font-medium text-ink">Actual bedtime</span>
          <input
            type="time"
            value={draft.bedtime ?? ""}
            onChange={(e) => onChange({ bedtime: e.target.value || null })}
            className={`w-[128px] px-2 ${INPUT}`}
          />
        </label>
        <div className="my-2 h-px bg-line" />
        <ScalePicker label={FIELD_LABELS.mood} value={draft.mood} onChange={(v) => onChange({ mood: v })} tone="pink" />
        <ScalePicker label={FIELD_LABELS.energy} value={draft.energy} onChange={(v) => onChange({ energy: v })} tone="mint" />
      </div>
    </Collapsible>
  );
}
