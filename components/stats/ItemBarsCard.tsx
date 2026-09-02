import Card from "@/components/ui/Card";
import type { ItemCount } from "@/lib/stats";

interface Props {
  counts: ItemCount[];
}

const COLORS = ["#EC4B98", "#2EB8E6", "#1FC29A", "#9B5DE5", "#FF7A3D", "#FFB627"];

/** Days each item was logged, as a count and a share of the days so far. */
export default function ItemBarsCard({ counts }: Props) {
  return (
    <Card title="Days logged per item">
      {counts.length === 0 ? (
        <p className="text-sm text-ink-faint">Nothing logged in this period yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {counts.map((c, i) => (
            <li key={c.item.id} className="flex flex-col gap-1.5">
              <div className="flex justify-between gap-2 text-[13px] font-medium">
                <span className="text-ink">{c.item.label}</span>
                <span className="text-ink-soft">
                  {c.days} {c.days === 1 ? "day" : "days"} · {Math.round(c.ratio * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-[5px] bg-pink-200">
                <div className="h-2 rounded-[5px]" style={{ width: `${Math.min(100, c.ratio * 100)}%`, background: COLORS[i % COLORS.length] }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
