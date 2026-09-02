"use client";

import Link from "next/link";
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
      action={
        <Link href={`/settings#${group}`} aria-label={`Edit ${meta.title} items`} className="flex h-9 w-9 items-center justify-center rounded-full text-ink-faint active:bg-black/5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </Link>
      }
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
