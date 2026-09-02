"use client";

interface Props {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}

/** Five dots, 1–5. Tapping the selected dot clears it back to "not recorded". */
export default function ScalePicker({ label, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-ink-soft">{label}</span>
      <div className="flex gap-2" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = value === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(on ? null : n)}
              className={`flex h-11 flex-1 items-center justify-center rounded-xl border text-base transition-colors ${
                on ? "border-moss-500 bg-moss-500 text-white" : "border-line bg-card text-ink-soft"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
