import type { PlantDef } from "@/lib/garden-logic";
import Plant from "./Plant";

const W = 360;
const H = 200;
const GROUND_Y = 150;

interface Props {
  plants: PlantDef[];
}

/** A simple, calm SVG scene. Plants appear as they unlock and never leave. */
export default function GardenView({ plants }: Props) {
  // Draw far-back (larger) plants first so smaller ones sit in front.
  const ordered = [...plants].sort((a, b) => b.threshold - a.threshold);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full rounded-2xl border border-line"
      role="img"
      aria-label="Your garden"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8f0f4" />
          <stop offset="1" stopColor="#f7f4ee" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sky)" />
      <circle cx={W - 50} cy={44} r={18} fill="#f4e3b0" />
      <path
        d={`M0 ${GROUND_Y} Q${W / 2} ${GROUND_Y - 10} ${W} ${GROUND_Y} V${H} H0 Z`}
        fill="#cfe0c4"
      />
      <path d={`M0 ${GROUND_Y + 22} Q${W / 2} ${GROUND_Y + 12} ${W} ${GROUND_Y + 22} V${H} H0 Z`} fill="#bcd2ae" />
      {ordered.map((p) => (
        <Plant key={p.kind} plant={p} groundY={GROUND_Y - 4} sceneWidth={W} />
      ))}
    </svg>
  );
}
