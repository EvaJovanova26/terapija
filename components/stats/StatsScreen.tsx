"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { parseDate, todayLocal } from "@/lib/date";
import { itemPoints } from "@/lib/garden-logic";
import { average, inRange, itemCounts, periodPoints, periodRange, series, sum, type Period } from "@/lib/stats";
import { createClient } from "@/lib/supabase/client";
import { fetchAllEntries, fetchItems } from "@/lib/supabase/queries";
import type { Entry, Item } from "@/lib/types";
import Sym, { VB } from "@/components/art/Sym";
import Card from "@/components/ui/Card";
import PeriodSwitch from "./PeriodSwitch";
import BarCard from "./BarCard";
import MoodEnergyCard from "./MoodEnergyCard";
import ItemBarsCard from "./ItemBarsCard";

const short = (d: string) => parseDate(d).toLocaleDateString(undefined, { day: "numeric", month: "short" });

export default function StatsScreen() {
  const [period, setPeriod] = useState<Period>("week");
  const [data, setData] = useState<{ entries: Entry[]; items: Item[] } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const db = createClient();
    Promise.all([fetchAllEntries(db), fetchItems(db)])
      .then(([entries, items]) => !cancelled && setData({ entries, items }))
      .catch(() => !cancelled && setData({ entries: [], items: [] }));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return <div className="h-40" aria-hidden />;

  const today = todayLocal();
  const range = periodRange(period, today);
  const entries = inRange(data.entries, range);
  const pts = periodPoints(data.entries, range, itemPoints(data.items), today);
  const word = period === "week" ? "week" : period === "month" ? "month" : "12 weeks";
  const from = short(range.start);
  const to = short(range.end);
  const noted = entries.filter((e) => (e.note ?? "").trim().length > 0);
  const sleep = series(entries, range, "sleep_hours");
  const gaming = series(entries, range, "gaming_hours");
  const alcohol = series(entries, range, "alcohol_units");
  const km = series(entries, range, "km_walked");

  return (
    <div className="flex flex-col gap-3">
      <header className="flex items-start justify-between">
        <h1 className="font-display text-[26px] font-semibold text-ink">Stats</h1>
        <Sym id="d-sprig" vb={VB.sprig} width={70} />
      </header>
      <PeriodSwitch value={period} onChange={setPeriod} />
      <Card>
        <p className="text-[13px] font-medium text-ink-soft">Points this {word}</p>
        <p className="flex items-baseline gap-2 pt-1">
          <span className="font-display text-[38px] font-bold leading-none text-ink">{pts.total.toLocaleString()}</span>
          <span className="text-[13px] font-medium text-ink-faint">avg {pts.perDay} a day</span>
        </p>
      </Card>
      <BarCard title="Sleep hours" meta={average(sleep) !== null ? `avg ${average(sleep)}` : "—"} values={sleep} color="#2EB8E6" from={from} to={to} />
      <BarCard title="Gaming hours" meta={average(gaming) !== null ? `avg ${average(gaming)}` : "—"} values={gaming} color="#9B5DE5" from={from} to={to} />
      <BarCard title="Alcohol units" meta={`${alcohol.filter((v) => v !== null && v > 0).length} of ${range.days.filter((d) => d <= today).length} days`} values={alcohol} color="#FF7A3D" from={from} to={to} />
      <BarCard title="Km walked" meta={`${sum(km)} km`} values={km} color="#1FC29A" from={from} to={to} />
      <MoodEnergyCard mood={series(entries, range, "mood")} energy={series(entries, range, "energy")} />
      <ItemBarsCard counts={itemCounts(entries, data.items, range, today)} />
      <Link href="/notes" className="rounded-[22px] border border-line bg-card p-4 active:bg-pink-100">
        <div className="flex items-center justify-between text-[15px] font-semibold text-ink">
          Notes written <span className="text-[13px] font-medium text-ink-faint">{noted.length} {noted.length === 1 ? "note" : "notes"} ›</span>
        </div>
        {noted.length > 0 && <p className="line-clamp-2 pt-2 text-sm leading-relaxed text-ink-soft">{noted[noted.length - 1].note}</p>}
      </Link>
    </div>
  );
}
