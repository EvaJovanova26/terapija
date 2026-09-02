"use client";

import Collapsible from "@/components/ui/Collapsible";
import Toggle from "@/components/ui/Toggle";
import { GROUP_META, type Item, type ItemGroup } from "@/lib/types";
import AddItemRow from "./AddItemRow";

interface Props {
  group: ItemGroup;
  items: Item[];
  done: string[];
  onToggle: (id: string, on: boolean) => void;
  onAdd: (label: string) => Promise<void>;
}

const TONE: Record<ItemGroup, "default" | "soft" | "bright"> = {
  core: "default",
  extra: "soft",
  superpower: "bright",
};

export default function ItemSection({ group, items, done, onToggle, onAdd }: Props) {
  const meta = GROUP_META[group];
  const pts = items.length && items.every((i) => i.points === items[0].points) ? items[0].points : meta.defaultPoints;
  const doneSet = new Set(done);
  return (
    <Collapsible id={group} title={meta.title} tag={`${pts} pt each`} hint={meta.hint} tone={TONE[group]}>
      <div className="grid grid-cols-1 gap-2">
        {items.map((item) => (
          <Toggle
            key={item.id}
            tone={group}
            label={item.label}
            checked={doneSet.has(item.id)}
            onChange={(on) => onToggle(item.id, on)}
          />
        ))}
        <AddItemRow onAdd={onAdd} disabled={items.length >= meta.maxItems} />
      </div>
    </Collapsible>
  );
}
