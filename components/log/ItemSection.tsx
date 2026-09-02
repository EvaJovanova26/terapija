"use client";

import Collapsible from "@/components/ui/Collapsible";
import Toggle from "@/components/ui/Toggle";
import Sym, { VB } from "@/components/art/Sym";
import { GROUP_META, type Item, type ItemGroup } from "@/lib/types";
import AddItemRow from "./AddItemRow";

interface Props {
  group: ItemGroup;
  items: Item[];
  done: string[];
  onToggle: (id: string, on: boolean) => void;
  onAdd: (label: string) => Promise<void>;
}

export default function ItemSection({ group, items, done, onToggle, onAdd }: Props) {
  const meta = GROUP_META[group];
  const same = items.length > 0 && items.every((i) => i.points === items[0].points);
  const pts = same ? items[0].points : meta.defaultPoints;
  const tag = `${pts} pt${pts === 1 ? "" : "s"} each`;
  const doneSet = new Set(done);
  return (
    <Collapsible
      id={group}
      title={meta.title}
      tag={tag}
      tone={group}
      icon={group === "superpower" ? <Sym id="i-sparkle" vb={VB.icon} width={18} /> : undefined}
    >
      <div className="flex flex-col gap-0.5">
        {items.map((item) => (
          <Toggle key={item.id} tone={group} label={item.label} checked={doneSet.has(item.id)} onChange={(on) => onToggle(item.id, on)} />
        ))}
        <AddItemRow tone={group} onAdd={onAdd} disabled={items.length >= meta.maxItems} />
      </div>
    </Collapsible>
  );
}
