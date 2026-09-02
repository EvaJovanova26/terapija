import type { PlantDef } from "@/lib/garden-logic";
import Card from "@/components/ui/Card";

interface Props {
  points: number;
  streak: number;
  next: PlantDef | null;
  unlocked: PlantDef[];
}

/** Lifetime total, streak, and next unlock. */
export default function GardenStats({ points, streak, next, unlocked }: Props) {
  return (
    <Card>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-sm text-ink-soft">Lifetime</p>
          <p className="text-3xl font-semibold">{points}</p>
        </div>
        <div>
          <p className="text-sm text-ink-soft">Streak</p>
          <p className="text-3xl font-semibold">
            {streak}
            <span className="ml-1 text-base font-normal text-ink-soft">{streak === 1 ? "day" : "days"}</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-ink-soft">Next</p>
          <p className="text-base leading-tight">{next ? `${next.name} at ${next.threshold}` : "All here"}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-faint">
        Points only ever go up. A day after a zero day counts double.
      </p>
      {unlocked.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {unlocked.map((p) => (
            <li key={p.kind} className="rounded-full bg-moss-100 px-3 py-1 text-sm text-moss-700">
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
