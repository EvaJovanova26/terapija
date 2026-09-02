"use client";

interface Props {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  /** "core" is filled moss when on; "upside" is a lighter, secondary style. */
  tone?: "core" | "upside";
}

/** Large, one-thumb tap target. Off is a neutral outline — never a warning. */
export default function Toggle({ label, checked, onChange, tone = "core" }: Props) {
  const on =
    tone === "core"
      ? "bg-moss-500 border-moss-500 text-white"
      : "bg-moss-100 border-moss-300 text-moss-700";
  const off = "bg-card border-line text-ink";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 text-left text-base transition-colors ${checked ? on : off}`}
    >
      <span
        aria-hidden
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          checked ? "border-white/70 bg-white/25" : "border-line"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3.5 8.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="flex-1">{label}</span>
    </button>
  );
}
