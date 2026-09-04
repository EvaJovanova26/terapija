import Link from "next/link";
import { parseDate } from "@/lib/date";
import type { Row } from "@/lib/grow/tapestry";

interface Props {
  rows: Row[];
}

const HEIGHT = [4, 7, 10];
const monthLabel = (d: string) => parseDate(d).toLocaleDateString(undefined, { month: "short", year: "2-digit" });

/** The cloth. One horizontal band per day, oldest at the top, newest at the bottom. */
export default function TapestryRows({ rows }: Props) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-1 flex-col gap-px overflow-hidden rounded-[18px] border-2 border-[#8f6a4a] bg-[color:var(--t-undyed)] p-1">
        {rows.map((r) => {
          const color = r.mood ? `var(--t-mood-${r.mood})` : r.logged ? "var(--t-sage)" : "var(--t-undyed)";
          return (
            <Link
              key={r.date}
              href={`/entry/${r.date}`}
              aria-label={r.date}
              className="relative block w-full rounded-sm"
              style={{ height: HEIGHT[r.weight], background: color, opacity: r.logged ? 1 : 0.6 }}
            >
              {r.gold && <span className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-gold" />}
            </Link>
          );
        })}
      </div>
      <div className="relative w-12">
        {rows.map((r, i) =>
          r.monthStart ? (
            <span key={r.date} className="absolute text-[10px] font-semibold text-ink-faint" style={{ top: rows.slice(0, i).reduce((s, x) => s + HEIGHT[x.weight] + 1, 4) }}>
              {monthLabel(r.date)}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}
