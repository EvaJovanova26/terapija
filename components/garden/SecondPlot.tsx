import { PLOT_TWO, type PlantDef } from "@/lib/garden-logic";

interface Props {
  plants: PlantDef[];
}

/** Opens when plot one is full. Shows what has grown here so far, with faint hints of the next two. */
export default function SecondPlot({ plants }: Props) {
  const grown = plants.filter((p) => PLOT_TWO.some((q) => q.threshold === p.threshold && q.threshold > PLOT_TWO[0].threshold));
  const hints = PLOT_TWO.slice(grown.length + 1, grown.length + 3);
  const slot = (i: number) => 30 + i * 52;
  return (
    <div className="overflow-hidden rounded-[22px] border border-line">
      <div className="flex items-center justify-between bg-card px-3.5 py-3">
        <p className="font-display text-base font-semibold text-ink">Second plot</p>
        <span className="rounded-full bg-mint-100 px-2.5 py-1.5 text-[11px] font-semibold text-ink-soft">
          {grown.length === 0 ? "just opened" : `${grown.length} growing`}
        </span>
      </div>
      <svg viewBox="0 0 390 120" className="block w-full" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <rect width="390" height="120" fill="#E8FBF0" />
        <ellipse cx="150" cy="96" rx="200" ry="34" fill="#A6E8C4" />
        <rect y="100" width="390" height="20" fill="#52C48A" />
        <use href="#p-sprout" x="30" y="57" width="44" height="55" />
        {grown.map((p, i) => (
          <use key={p.threshold} href={`#p-${p.kind}`} x={slot(i + 1)} y="60" width="44" height="55" />
        ))}
        {hints.map((p, i) => (
          <use key={p.threshold} href={`#p-${p.kind}`} x={slot(grown.length + 1 + i)} y="64" width="36" height="45" opacity=".28" />
        ))}
      </svg>
    </div>
  );
}
