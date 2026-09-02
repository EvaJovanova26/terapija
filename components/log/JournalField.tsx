"use client";

import Collapsible from "@/components/ui/Collapsible";

interface Props {
  value: string | null;
  onChange: (note: string | null) => void;
}

export default function JournalField({ value, onChange }: Props) {
  return (
    <Collapsible id="note" title="Note">
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        placeholder="what happened today?"
        rows={5}
        className="w-full resize-y rounded-xl border border-line bg-card px-3 py-2 text-base leading-relaxed outline-none placeholder:text-ink-faint focus:border-moss-500"
      />
    </Collapsible>
  );
}
