import Sym, { VB } from "@/components/art/Sym";
import { flowerStage, type PlantDef } from "@/lib/garden-logic";

interface Props {
  points: number;
  progress: number;
  next: PlantDef | null;
}

/** Lifetime points and a flower that opens as the next plant approaches. */
export default function ProgressCard({ points, progress, next }: Props) {
  const pct = Math.round(progress * 100);
  return (
    <div className="flex items-center gap-4 rounded-[22px] border border-line bg-card p-4">
      <Sym id={flowerStage(progress)} vb={VB.flower} width={58} className="shrink-0" />
      <div className="flex flex-1 flex-col gap-2">
        <p className="font-display text-[19px] font-semibold leading-tight text-ink">{points.toLocaleString()} points</p>
        <div className="h-[9px] overflow-hidden rounded-md bg-pink-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-md bg-pink-500 transition-[width]" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[13px] font-medium text-ink-soft">
          {next ? `next: ${next.name} at ${next.threshold.toLocaleString()}` : "every plant is here"}
        </p>
      </div>
    </div>
  );
}
