"use client";

import { useItems } from "@/components/items/useItems";
import Collapsible from "@/components/ui/Collapsible";
import AddItemRow from "@/components/log/AddItemRow";
import { GROUP_META, ITEM_GROUPS } from "@/lib/types";
import ItemRow from "./ItemRow";

/** Rename, re-point, reorder, retire, and add items in each group. */
export default function ItemsEditor() {
  const { items, active, add, patch, move } = useItems();
  if (items === null) return <div className="h-40" aria-hidden />;

  return (
    <div className="flex flex-col gap-4">
      {ITEM_GROUPS.map((group) => {
        const live = active(group).sort((a, b) => a.sort_order - b.sort_order);
        const retired = items.filter((i) => i.group_name === group && i.retired_at);
        const meta = GROUP_META[group];
        return (
          <Collapsible
            key={group}
            id={`settings-${group}`}
            title={meta.title}
            tag={`${live.length} of ${meta.maxItems} slots`}
            hint="Retired items disappear from the log but past days keep them."
          >
            <div className="flex flex-col gap-2">
              {live.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onPatch={(changes) => patch(item.id, changes)}
                  onMove={(dir) => move(item.id, dir)}
                />
              ))}
              <AddItemRow onAdd={(label) => add(group, label)} disabled={live.length >= meta.maxItems} />
              {retired.map((item) => (
                <ItemRow key={item.id} item={item} onPatch={(changes) => patch(item.id, changes)} onMove={async () => {}} />
              ))}
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
