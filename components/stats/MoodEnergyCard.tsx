import Card from "@/components/ui/Card";

interface Props {
  mood: (number | null)[];
  energy: (number | null)[];
}

/** Two dot-lines on a 1–5 scale. Missing days are simply absent. */
export default function MoodEnergyCard({ mood, energy }: Props) {
  const n = mood.length;
  const x = (i: number) => `${(i + 0.5) * (100 / n)}%`;
  const y = (v: number) => 40 - (v - 1) * 9;
  return (
    <Card title="Mood and energy">
      <div className="relative h-12">
        {mood.map((v, i) => v !== null && <span key={`m${i}`} className="absolute h-2 w-2 -translate-x-1/2 rounded-full bg-violet" style={{ left: x(i), top: y(v) }} />)}
        {energy.map((v, i) => v !== null && <span key={`e${i}`} className="absolute h-2 w-2 -translate-x-1/2 rounded-full bg-mint" style={{ left: x(i), top: y(v) + 2 }} />)}
      </div>
      <div className="flex gap-4 pt-3 text-xs font-medium text-ink-soft">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet" /> mood</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-mint" /> energy</span>
      </div>
    </Card>
  );
}
