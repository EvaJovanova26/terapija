import Sym, { VB } from "@/components/art/Sym";
import type { BadgeDef } from "@/lib/badges";
import type { PlantDef } from "@/lib/garden-logic";

interface Props {
  plants: PlantDef[];
  badges: BadgeDef[];
}

const chip = "flex items-center gap-1.5 rounded-full border border-input-line bg-card py-1.5 pl-2 pr-3 text-xs font-semibold text-ink-soft";

/** Everything unlocked so far. Only earned things are shown, never the missing ones. */
export default function PlantChips({ plants, badges }: Props) {
  return (
    <ul className="flex flex-wrap gap-2">
      {plants.map((p, i) => (
        <li key={`${p.kind}-${i}`} className={chip}>
          <Sym id={`p-${p.kind}`} vb={VB.plant} width={16} /> {p.name}
        </li>
      ))}
      {badges.map((b) => (
        <li key={b.kind} className={chip} title={b.rule}>
          <Sym id={`o-${b.kind}`} vb={VB.object} width={18} /> {b.name}
        </li>
      ))}
    </ul>
  );
}
