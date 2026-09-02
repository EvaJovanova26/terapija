import Card from "@/components/ui/Card";

interface Props {
  title: string;
  meta: string;
  values: (number | null)[];
  color: string;
  from: string;
  to: string;
}

/** Bars for each day. Days without a value show as a thin gap, never as zero. */
export default function BarCard({ title, meta, values, color, from, to }: Props) {
  const max = Math.max(1, ...values.map((v) => v ?? 0));
  return (
    <Card title={title} meta={meta}>
      <div className="flex h-16 items-end gap-[3px] border-b border-line pb-0.5">
        {values.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-[5px]"
            style={v === null ? { height: 3, background: "#F2AFD3" } : { height: `${Math.max(8, (v / max) * 100)}%`, background: color }}
            title={v === null ? "not recorded" : String(v)}
          />
        ))}
      </div>
      <div className="flex justify-between pt-2 text-[11px] font-medium text-ink-faint">
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </Card>
  );
}
