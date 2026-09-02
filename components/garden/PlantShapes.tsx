import type { PlantKind } from "@/lib/garden-logic";

const G = "#7fa471";
const GD = "#587a4d";
const GL = "#b4cda6";
const TRUNK = "#9a7b5a";

/** Each shape is drawn with its base at (0,0), growing upward (negative y). */
export const SHAPES: Record<PlantKind, React.ReactNode> = {
  sprout: (
    <g>
      <path d="M0 0 V-14" stroke={GD} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="-5" cy="-12" rx="5" ry="3" fill={G} transform="rotate(-30 -5 -12)" />
      <ellipse cx="5" cy="-15" rx="5" ry="3" fill={G} transform="rotate(30 5 -15)" />
    </g>
  ),
  clover: (
    <g fill={G}>
      {[-8, 0, 8].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <path d="M0 0 V-8" stroke={GD} strokeWidth="1.5" />
          <circle cx="-3" cy="-10" r="3" />
          <circle cx="3" cy="-10" r="3" />
          <circle cx="0" cy="-13" r="3" />
        </g>
      ))}
    </g>
  ),
  tulip: (
    <g>
      {[-9, 0, 9].map((x, i) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <path d="M0 0 V-18" stroke={GD} strokeWidth="1.8" />
          <path d="M-5 -18 Q-5 -28 0 -28 Q5 -28 5 -18 Q0 -14 -5 -18Z" fill={["#e7a7b2", "#f0c58f", "#d9a6d4"][i]} />
        </g>
      ))}
    </g>
  ),
  fern: (
    <g stroke={G} strokeWidth="2" strokeLinecap="round" fill="none">
      <path d="M0 0 Q-12 -14 -16 -30" />
      <path d="M0 0 Q0 -18 -2 -34" />
      <path d="M0 0 Q12 -14 16 -30" />
      <path d="M0 0 Q-6 -20 -10 -36" stroke={GL} />
      <path d="M0 0 Q6 -20 10 -36" stroke={GL} />
    </g>
  ),
  lavender: (
    <g>
      {[-8, -3, 3, 8].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <path d="M0 0 V-26" stroke={G} strokeWidth="1.5" />
          <ellipse cx="0" cy="-29" rx="2.5" ry="7" fill="#a998cf" />
        </g>
      ))}
    </g>
  ),
  bush: (
    <g>
      <ellipse cx="0" cy="-12" rx="20" ry="13" fill={G} />
      <ellipse cx="-8" cy="-18" rx="11" ry="9" fill={GD} />
      <ellipse cx="9" cy="-17" rx="10" ry="8" fill={GL} />
      {[-10, 2, 12].map((x, i) => (
        <circle key={x} cx={x} cy={-10 - i * 3} r="2.2" fill="#c98aa0" />
      ))}
    </g>
  ),
  sunflower: (
    <g>
      <path d="M0 0 V-48" stroke={GD} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="-7" cy="-22" rx="7" ry="3.5" fill={G} transform="rotate(-25 -7 -22)" />
      {Array.from({ length: 10 }).map((_, i) => (
        <ellipse key={i} cx="0" cy="-58" rx="3.5" ry="8" fill="#e9c15b" transform={`rotate(${i * 36} 0 -48)`} />
      ))}
      <circle cx="0" cy="-48" r="6" fill="#7a5a3a" />
    </g>
  ),
  sapling: (
    <g>
      <path d="M0 0 V-34" stroke={TRUNK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy="-42" r="13" fill={G} />
      <circle cx="-8" cy="-36" r="8" fill={GD} />
    </g>
  ),
  tree: (
    <g>
      <path d="M0 0 V-40" stroke={TRUNK} strokeWidth="5" strokeLinecap="round" />
      <circle cx="0" cy="-58" r="24" fill={G} />
      <circle cx="-16" cy="-48" r="15" fill={GD} />
      <circle cx="16" cy="-50" r="14" fill={GL} />
      {[-10, 4, 14, -2].map((x, i) => (
        <circle key={i} cx={x} cy={-54 + (i % 2) * 10} r="2.5" fill="#d98a7a" />
      ))}
    </g>
  ),
  willow: (
    <g>
      <path d="M0 0 V-52" stroke={TRUNK} strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="0" cy="-60" rx="30" ry="16" fill={G} />
      {[-26, -16, -6, 4, 14, 24].map((x) => (
        <path key={x} d={`M${x} -60 Q${x - 2} -35 ${x + 1} -18`} stroke={GL} strokeWidth="2" fill="none" strokeLinecap="round" />
      ))}
    </g>
  ),
};
