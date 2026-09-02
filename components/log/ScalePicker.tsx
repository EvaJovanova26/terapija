"use client";

interface Props {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  tone?: "pink" | "mint";
}

const RING = { pink: "border-input-line", mint: "border-mint-300" };
const FILL = { pink: "bg-pink-500 border-pink-500", mint: "bg-mint border-mint" };

/** Five dots that fill up to the chosen value. Tapping the current value clears it. */
export default function ScalePicker({ label, value, onChange, tone = "pink" }: Props) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="flex-1 text-[15px] font-medium text-ink">{label}</span>
      <div className="flex gap-2" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = value !== null && n <= value;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${label} ${n}`}
              onClick={() => onChange(value === n ? null : n)}
              className={`h-[26px] w-[26px] rounded-full border-[1.5px] transition-colors ${filled ? FILL[tone] : RING[tone]}`}
            />
          );
        })}
      </div>
    </div>
  );
}
