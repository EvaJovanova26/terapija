"use client";

import { useMemo } from "react";
import Link from "next/link";
import { addDays, formatLong } from "@/lib/date";
import { basePoints, itemPoints } from "@/lib/garden-logic";
import { ITEM_GROUPS } from "@/lib/types";
import { useItems } from "@/components/items/useItems";
import Sym, { VB } from "@/components/art/Sym";
import AvatarFigure, { poseForPoints } from "@/components/you/AvatarFigure";
import { useProfile } from "@/components/you/useProfile";
import ItemSection from "./ItemSection";
import NumberInputs from "./NumberInputs";
import JournalField from "./JournalField";
import SaveBar from "./SaveBar";
import { useEntry } from "./useEntry";
import { useRebound } from "./useRebound";

interface Props {
  date: string;
  backHref?: string;
}

export default function EntryForm({ date, backHref }: Props) {
  const { draft, status, update, retry } = useEntry(date);
  const { items, error, active, add } = useItems();
  const { avatar } = useProfile();
  const points = useMemo(() => (items ? itemPoints(items) : null), [items]);
  const rebound = useRebound(date, points);
  const loading = status === "loading" || items === null;
  const today = points ? basePoints(draft, points) * (rebound ? 2 : 1) : 0;

  function toggle(id: string, on: boolean) {
    const rest = draft.done_items.filter((x) => x !== id);
    update({ done_items: on ? [...rest, id] : rest });
  }

  return (
    <div className={`flex flex-col gap-3 transition-opacity ${loading ? "opacity-60" : ""}`}>
      {backHref && (
        <Link href={backHref} className="py-1 text-sm font-semibold text-pink-700">
          ‹ Calendar
        </Link>
      )}
      <header className="flex items-start justify-between gap-3 px-0.5">
        <div>
          <h1 className="font-display text-[26px] font-semibold leading-tight text-ink">{formatLong(date)}</h1>
          <p className="mt-0.5 text-sm font-medium text-ink-soft">{today} points {backHref ? "that day" : "today"}</p>
        </div>
        <div className="flex flex-col items-end">
          <AvatarFigure avatar={avatar ?? {}} pose={poseForPoints(today)} size={56} />
          <SaveBar status={status} onRetry={retry} />
        </div>
      </header>

      {rebound && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-gold-300 bg-[#fffbf2] px-3 py-3">
          <Sym id="i-sparkle" vb={VB.icon} width={18} />
          <p className="text-[13px] font-semibold text-ink-soft">Everything counts double today</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-line bg-card px-3 py-3 text-[13px] leading-relaxed text-ink-soft">
          Your items couldn&apos;t load, so nothing can be ticked yet. This usually means the database update in
          <span className="font-semibold"> supabase/migrations/002_dynamic_items.sql</span> hasn&apos;t been run.
        </div>
      )}
      <fieldset disabled={loading} className="contents">
        {ITEM_GROUPS.map((group) => (
          <ItemSection key={group} group={group} items={active(group)} done={draft.done_items} onToggle={toggle} onAdd={(label) => add(group, label)} />
        ))}
        <NumberInputs draft={draft} onChange={update} />
        <JournalField value={draft.note} onChange={(note) => update({ note })} />
      </fieldset>
      <div className="flex justify-between px-2 pt-1 text-sm font-semibold text-pink-700">
        <Link href={`/entry/${addDays(date, -1)}`}>‹ {backHref ? "day before" : "fill in yesterday"}</Link>
        <Link href="/settings">edit items</Link>
      </div>
    </div>
  );
}
