"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteItem, fetchItems, insertItem, saveItemOrder, updateItem } from "@/lib/supabase/queries";
import { GROUP_META, type Item, type ItemGroup } from "@/lib/types";

const bySort = (a: Item, b: Item) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at);

/** Loads the user's items and exposes small mutations. Seeds defaults on first use. */
export function useItems() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchItems(createClient())
      .then((rows) => !cancelled && setItems(rows))
      .catch((e: Error) => {
        if (cancelled) return;
        setItems([]);
        setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Live items in one group, in display order. */
  const active = useCallback(
    (group: ItemGroup) => (items ?? []).filter((i) => i.group_name === group && !i.retired_at).sort(bySort),
    [items],
  );

  const add = useCallback(
    async (group: ItemGroup, label: string) => {
      const trimmed = label.trim();
      if (!trimmed) return;
      const siblings = active(group);
      if (siblings.length >= GROUP_META[group].maxItems) return;
      const sort_order = Math.max(0, ...siblings.map((i) => i.sort_order)) + 1;
      const created = await insertItem(createClient(), { label: trimmed, group_name: group, points: GROUP_META[group].defaultPoints, sort_order });
      setItems((cur) => [...(cur ?? []), created]);
    },
    [active],
  );

  const patch = useCallback(async (id: string, changes: Partial<Item>) => {
    const updated = await updateItem(createClient(), id, changes);
    setItems((cur) => (cur ?? []).map((i) => (i.id === id ? updated : i)));
  }, []);

  /** Permanent. Past days keep the id in their list but it no longer counts or shows. */
  const remove = useCallback(async (id: string) => {
    await deleteItem(createClient(), id);
    setItems((cur) => (cur ?? []).filter((i) => i.id !== id));
  }, []);

  /** Applies a new order for one group. Updates the screen first, then the database. */
  const reorder = useCallback(async (ids: string[]) => {
    setItems((cur) => (cur ?? []).map((i) => (ids.includes(i.id) ? { ...i, sort_order: ids.indexOf(i.id) + 1 } : i)));
    await saveItemOrder(createClient(), ids);
  }, []);

  return { items, error, active, add, patch, remove, reorder };
}
