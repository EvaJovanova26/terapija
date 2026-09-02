"use client";

import Collapsible from "@/components/ui/Collapsible";
import Sym, { VB } from "@/components/art/Sym";

interface Props {
  value: string | null;
  onChange: (note: string | null) => void;
}

export default function JournalField({ value, onChange }: Props) {
  return (
    <Collapsible id="note" title="Note">
      <div className="px-2.5 pb-2">
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
          placeholder="what happened today?"
          rows={4}
          className="w-full resize-none rounded-2xl border-[1.5px] border-input-line bg-input px-3 py-3 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:border-pink-300"
        />
        <div className="flex justify-center pt-3 opacity-85">
          <Sym id="d-garland" vb={VB.garland} width={200} />
        </div>
      </div>
    </Collapsible>
  );
}
