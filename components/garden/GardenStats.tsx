import type { PlantDef } from "@/lib/garden-logic";
import Card from "@/components/ui/Card";

interface Props {
  points: number;
  next: PlantDef | null;
  unlocked: PlantDef[];
}

/** Lifetime total and next unlock only. No daily or weekly figures. */
export default function GardenStats({ points, next, unlocked }: Props) {
  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm text-ink-soft">Lifetime points</p>
          <p className="text-3xl font-semibold">{points}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-ink-soft">Next plant</p>
          <p className="text-lg">{next ? `${next.name} at ${next.threshold}` : "Every plant is here"}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-faint">
        Points only ever go up. Nothing here fades, wilts, or resets.
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
