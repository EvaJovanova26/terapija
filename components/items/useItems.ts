"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchItems, insertItem, updateItem } from "@/lib/supabase/queries";
import { GROUP_META, type Item, type ItemGroup } from "@/lib/types";

/** Loads the user's items and exposes small mutations. Seeds defaults on first use. */
export function useItems() {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchItems(createClient())
      .then((rows) => !cancelled && setItems(rows))
      .catch(() => !cancelled && setItems([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const active = useCallback(
    (group: ItemGroup) => (items ?? []).filter((i) => i.group_name === group && !i.retired_at),
    [items],
  );

  const add = useCallback(
    async (group: ItemGroup, label: string) => {
      const trimmed = label.trim();
      if (!trimmed) return;
      const siblings = active(group);
      if (siblings.length >= GROUP_META[group].maxItems) return;
      const sort_order = Math.max(0, ...siblings.map((i) => i.sort_order)) + 1;
      const created = await insertItem(createClient(), {
        label: trimmed,
        group_name: group,
        points: GROUP_META[group].defaultPoints,
        sort_order,
      });
      setItems((cur) => [...(cur ?? []), created]);
    },
    [active],
  );

  const patch = useCallback(async (id: string, changes: Partial<Item>) => {
    const updated = await updateItem(createClient(), id, changes);
    setItems((cur) => (cur ?? []).map((i) => (i.id === id ? updated : i)));
  }, []);

  /** Swap sort order with the neighbour above (-1) or below (+1) in the same group. */
  const move = useCallback(
    async (id: string, direction: -1 | 1) => {
      const item = (items ?? []).find((i) => i.id === id);
      if (!item) return;
      const group = active(item.group_name).sort((a, b) => a.sort_order - b.sort_order);
      const idx = group.findIndex((i) => i.id === id);
      const other = group[idx + direction];
      if (!other) return;
      const db = createClient();
      const [a, b] = await Promise.all([
        updateItem(db, item.id, { sort_order: other.sort_order }),
        updateItem(db, other.id, { sort_order: item.sort_order }),
      ]);
      setItems((cur) => (cur ?? []).map((i) => (i.id === a.id ? a : i.id === b.id ? b : i)));
    },
    [items, active],
  );

  return { items, active, add, patch, move };
}
