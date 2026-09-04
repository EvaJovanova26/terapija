"use client";

import { useState } from "react";
import type { Avatar } from "@/lib/types";
import { EYES, HAIR, SKIN } from "./AvatarFigure";

interface Props {
  avatar: Avatar;
  onChange: (patch: Partial<Avatar>) => void;
}

type Tab = "skin" | "hair" | "eyes";
const SETS: Record<Tab, string[]> = { skin: SKIN, hair: HAIR, eyes: EYES };

/** Colour choices now; hair styles, faces and outfits follow with the design sheet. */
export default function CustomisePanel({ avatar, onChange }: Props) {
  const [tab, setTab] = useState<Tab>("skin");
  const current = avatar[tab] ?? SETS[tab][tab === "skin" ? 1 : 0];
  return (
    <div className="rounded-[22px] border border-line bg-card p-3">
      <div className="flex gap-1 rounded-2xl bg-accent-soft p-1" role="tablist">
        {(["skin", "hair", "eyes"] as Tab[]).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`flex-1 rounded-[13px] py-2 text-sm font-semibold capitalize ${tab === t ? "bg-card text-ink" : "text-ink-soft"}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 px-1 pt-3" role="radiogroup" aria-label={`${tab} colour`}>
        {SETS[tab].map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={current === c}
            aria-label={c}
            onClick={() => onChange({ [tab]: c })}
            className={`h-9 w-9 rounded-full border-2 ${current === c ? "border-accent" : "border-line"}`}
            style={{ background: c }}
          />
        ))}
      </div>
      <p className="px-1 pt-3 text-xs text-ink-faint">Hair styles, faces and outfits arrive with the new artwork.</p>
    </div>
  );
}
