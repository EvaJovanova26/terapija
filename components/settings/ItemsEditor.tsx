"use client";

import { useItems } from "@/components/items/useItems";
import { ITEM_GROUPS } from "@/lib/types";
import GroupEditor from "./GroupEditor";

/** Rename, re-point, reorder, retire, delete, and add items in each group. */
export default function ItemsEditor() {
  const { items, active, add, patch, remove, reorder } = useItems();
  if (items === null) return <div className="h-40" aria-hidden />;

  return (
    <div className="flex flex-col gap-3.5">
      {ITEM_GROUPS.map((group) => (
        <GroupEditor
          key={group}
          group={group}
          live={active(group)}
          retired={items.filter((i) => i.group_name === group && i.retired_at)}
          onAdd={(label) => add(group, label)}
          onPatch={patch}
          onDelete={remove}
          onReorder={reorder}
        />
      ))}
    </div>
  );
}
