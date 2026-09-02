"use client";

import { useMemo } from "react";
import { formatLong } from "@/lib/date";
import { itemPoints } from "@/lib/garden-logic";
import { ITEM_GROUPS } from "@/lib/types";
import { useItems } from "@/components/items/useItems";
import ItemSection from "./ItemSection";
import NumberInputs from "./NumberInputs";
import JournalField from "./JournalField";
import SaveBar from "./SaveBar";
import { useEntry } from "./useEntry";
import { useRebound } from "./useRebound";

interface Props {
  date: string;
  heading: string;
}

export default function EntryForm({ date, heading }: Props) {
  const { draft, status, update, retry } = useEntry(date);
  const { items, active, add } = useItems();
  const points = useMemo(() => (items ? itemPoints(items) : null), [items]);
  const rebound = useRebound(date, points);
  const loading = status === "loading" || items === null;

  function toggle(id: string, on: boolean) {
    const rest = draft.done_items.filter((x) => x !== id);
    update({ done_items: on ? [...rest, id] : rest });
  }

  return (
    <div className={`flex flex-col gap-4 transition-opacity ${loading ? "opacity-60" : ""}`}>
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{heading}</h1>
          <p className="text-ink-soft">{formatLong(date)}</p>
          {rebound && <p className="mt-1 text-sm text-moss-700">counts double today</p>}
        </div>
        <SaveBar status={status} onRetry={retry} />
      </header>

      <fieldset disabled={loading} className="contents">
        {ITEM_GROUPS.map((group) => (
          <ItemSection
            key={group}
            group={group}
            items={active(group)}
            done={draft.done_items}
            onToggle={toggle}
            onAdd={(label) => add(group, label)}
          />
        ))}
        <NumberInputs draft={draft} onChange={update} />
        <JournalField value={draft.note} onChange={(note) => update({ note })} />
      </fieldset>
    </div>
  );
}
