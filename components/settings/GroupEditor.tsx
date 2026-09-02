"use client";

import { useState } from "react";
import Collapsible from "@/components/ui/Collapsible";
import AddItemRow from "@/components/log/AddItemRow";
import { GROUP_META, type Item, type ItemGroup } from "@/lib/types";
import ItemRow from "./ItemRow";
import { useDragList } from "./useDragList";

interface Props {
  group: ItemGroup;
  live: Item[];
  retired: Item[];
  onAdd: (label: string) => Promise<void>;
  onPatch: (id: string, changes: Partial<Item>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (ids: string[]) => Promise<void>;
}

/** One group's list with drag-to-reorder, tap-to-edit rows, and an add row. */
export default function GroupEditor({ group, live, retired, onAdd, onPatch, onDelete, onReorder }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const ids = live.map((i) => i.id);
  const drag = useDragList(ids, (next) => void onReorder(next));
  const byId = new Map(live.map((i) => [i.id, i]));
  const meta = GROUP_META[group];

  const row = (item: Item, draggable: boolean) => (
    <ItemRow
      key={item.id}
      item={item}
      open={openId === item.id}
      dragging={drag.dragging === item.id}
      onOpen={() => setOpenId(openId === item.id ? null : item.id)}
      onPatch={(c) => onPatch(item.id, c)}
      onDelete={() => onDelete(item.id)}
      handle={draggable ? drag.handleProps(item.id) : {}}
      rowRef={drag.rowRef(item.id)}
    />
  );

  return (
    <div id={group}>
      <Collapsible id={`settings-${group}`} title={meta.title} tag={`${live.length} of ${meta.maxItems}`} tone={group}>
        <div className="flex flex-col">
          {drag.order.map((id) => byId.get(id)).filter((i): i is Item => !!i).map((i) => row(i, true))}
          <AddItemRow tone={group} label="add item" onAdd={onAdd} disabled={live.length >= meta.maxItems} />
          {retired.map((i) => row(i, false))}
        </div>
      </Collapsible>
    </div>
  );
}
