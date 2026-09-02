"use client";

import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import { CORE_FIELDS, FIELD_LABELS, type EntryDraft } from "@/lib/types";

interface Props {
  draft: EntryDraft;
  onChange: (patch: Partial<EntryDraft>) => void;
}

export default function CoreChecklist({ draft, onChange }: Props) {
  return (
    <Card title="Core" hint="Tap whatever happened. Anything counts.">
      <div className="grid grid-cols-1 gap-2">
        {CORE_FIELDS.map((field) => (
          <Toggle
            key={field}
            label={FIELD_LABELS[field]}
            checked={draft[field]}
            onChange={(v) => onChange({ [field]: v })}
          />
        ))}
      </div>
    </Card>
  );
}
