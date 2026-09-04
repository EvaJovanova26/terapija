import type { TraitState } from "@/lib/grow/traits";

interface Props {
  states: TraitState[];
}

/** Levels only. A filled-dot ladder shows progress to the next level. */
export default function TraitsList({ states }: Props) {
  return (
    <ul className="flex flex-col divide-y divide-line rounded-[22px] border border-line bg-card px-4">
      {states.map(({ trait, level, progress }) => (
        <li key={trait.key} className="flex items-center gap-3 py-3">
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-ink">
              {trait.name} <span className="font-normal text-ink-soft">· level {level}</span>
            </p>
            <p className="text-xs text-ink-faint">{trait.blurb}</p>
          </div>
          <div className="flex gap-1" aria-label={`${Math.round(progress * 100)}% to level ${level + 1}`}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${progress > i / 5 ? "bg-accent" : "bg-line"}`} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
