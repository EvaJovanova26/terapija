"use client";

import type { ItemGroup } from "@/lib/types";

interface Props {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  tone?: ItemGroup;
}

const BOX: Record<ItemGroup, { off: string; on: string; size: string }> = {
  core: { off: "rounded-[9px] border-[1.5px] border-input-line bg-input", on: "rounded-[9px] bg-pink-500", size: "h-6 w-6" },
  extra: { off: "rounded-lg border-[1.5px] border-violet-400 bg-card", on: "rounded-lg bg-violet", size: "h-[22px] w-[22px]" },
  superpower: { off: "rounded-full border-[1.5px] border-gold-400 bg-card", on: "rounded-full bg-gold", size: "h-6 w-6" },
};
const LABEL: Record<ItemGroup, string> = {
  core: "font-medium text-ink",
  extra: "text-[#4a2470]",
  superpower: "font-semibold text-ink",
};

/** A storybook checklist row. Off is a soft outline, never a warning. */
export default function Toggle({ label, checked, onChange, tone = "core" }: Props) {
  const box = BOX[tone];
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-12 w-full items-center gap-3 rounded-[14px] px-2.5 py-2 text-left text-[15px] active:bg-black/5"
    >
      <span aria-hidden className={`flex shrink-0 items-center justify-center ${box.size} ${checked ? box.on : box.off}`}>
        {checked && tone !== "superpower" && (
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="#fff" strokeWidth="2.3">
            <path d="M2.6 7.4 L5.5 10.3 L11.4 3.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {checked && tone === "superpower" && (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#fff">
            <path d="M12 2 L14 9 L21 12 L14 15 L12 22 L10 15 L3 12 L10 9 Z" />
          </svg>
        )}
      </span>
      <span className={`flex-1 leading-snug ${LABEL[tone]}`}>{label}</span>
    </button>
  );
}
