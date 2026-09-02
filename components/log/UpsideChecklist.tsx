"use client";

import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import { FIELD_LABELS, UPSIDE_FIELDS, type EntryDraft } from "@/lib/types";

interface Props {
  draft: EntryDraft;
  onChange: (patch: Partial<EntryDraft>) => void;
}

export default function UpsideChecklist({ draft, onChange }: Props) {
  return (
    <Card title="Upside" hint="Bonus only. These are extras, never expected." tone="soft">
      <div className="grid grid-cols-1 gap-2">
        {UPSIDE_FIELDS.map((field) => (
          <Toggle
            key={field}
            tone="upside"
            label={FIELD_LABELS[field]}
            checked={draft[field]}
            onChange={(v) => onChange({ [field]: v })}
          />
        ))}
      </div>
    </Card>
  );
}
