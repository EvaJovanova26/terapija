import Link from "next/link";
import type { BadgeDef } from "@/lib/badges";
import type { PlantDef } from "@/lib/garden-logic";

interface Props {
  plants: PlantDef[];
  badges: BadgeDef[];
  streak: number;
  /** After 9pm the sun becomes a moon. */
  night: boolean;
}

const W = 390;
const H = 250;

/** The storybook scene. Everything placed here stays forever. */
export default function GardenScene({ plants, badges, streak, night }: Props) {
  return (
    <div className="relative -mx-4 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Your garden">
        <rect width={W} height={H} fill="url(#gSky)" />
        <circle cx="316" cy="50" r="34" fill={night ? "#DCC8F5" : "#FFE066"} opacity=".55" />
        <circle cx="316" cy="50" r="21" fill={night ? "#7B2FD4" : "#FFB627"} />
        <g fill="#FFF0F8">
          <path d="M52 46 C44 46 41 38 48 34 C47 26 58 22 63 28 C67 21 80 22 82 30 C90 28 95 34 91 40 C96 42 95 46 88 46 Z" />
          <path d="M120 60 C114 60 112 54 117 52 C117 47 124 45 128 49 C131 44 140 45 141 51 C147 50 150 55 145 60 Z" />
        </g>
        <path d="M0 168 C60 128 130 132 190 164 C240 190 300 190 390 168 L390 250 L0 250 Z" fill="#3FB984" />
        <path d="M0 190 C70 160 150 162 220 186 C280 206 340 200 390 186 L390 250 L0 250 Z" fill="#52C48A" />
        <path d="M0 206 C80 190 180 196 260 210 C310 218 350 216 390 208 L390 250 L0 250 Z" fill="#6BCB77" />
        <g stroke="#12856A" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".5">
          <path d="M24 250 C24 240 22 234 18 230" /><path d="M96 250 C96 238 99 232 104 228" />
          <path d="M210 250 C210 240 208 234 204 230" /><path d="M340 250 C340 240 343 234 348 231" />
        </g>
        <g><circle cx="70" cy="214" r="3.4" fill="#EC4B98" /><circle cx="70" cy="214" r="1.2" fill="#FFE066" /></g>
        <g><circle cx="150" cy="222" r="3.4" fill="#9B5DE5" /><circle cx="150" cy="222" r="1.2" fill="#FFF5FB" /></g>
        <g><circle cx="252" cy="226" r="3.4" fill="#FFB627" /><circle cx="252" cy="226" r="1.2" fill="#8F4620" /></g>
        <g><circle cx="330" cy="220" r="3.4" fill="#EC4B98" /><circle cx="330" cy="220" r="1.2" fill="#FFE066" /></g>
        {/* decorations */}
        <use href="#d-mushrooms" x="2" y={H - 2 - 23} width="46" height="23" />
        <use href="#d-mushroom" x="140" y={H - 56 - 30} width="30" height="30" />
        <use href="#d-butterfly" x="60" y={H - 150 - 20} width="26" height="20" />
        <use href="#d-butterfly" x="250" y={H - 168 - 15} width="20" height="15" />
        <use href="#d-bird" x="150" y={H - 196 - 20} width="26" height="20" />
        <use href="#d-sparkles" x="96" y={H - 176 - 22} width="22" height="22" />
        {/* earned objects sit behind plants */}
        {badges.map((b) => (
          <use key={b.kind} href={`#o-${b.kind}`} x={b.x} y={H - b.y - b.w * 0.75} width={b.w} height={b.w * 0.75}>
            <title>{b.name}</title>
          </use>
        ))}
        {plants.map((p, i) => (
          <use key={`${p.kind}-${i}`} href={`#p-${p.kind}`} x={p.x} y={H - p.y - p.w * 1.25} width={p.w} height={p.w * 1.25} className="bloom">
            <title>{p.name}</title>
          </use>
        ))}
      </svg>
      <div className="absolute left-4 top-3.5 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5">
        <svg width="14" height="14" viewBox="0 0 48 64" aria-hidden><use href="#f-100" /></svg>
        <span className="text-xs font-bold text-berry">{streak} {streak === 1 ? "day" : "days"}</span>
      </div>
      <Link href="/settings" aria-label="Settings" className="absolute right-3.5 top-3 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-white/85">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#8A3E7A" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="3.2" /><path d="M12 3.5v2.2M12 18.3v2.2M4.6 7.8l1.9 1.1M17.5 15.1l1.9 1.1M4.6 16.2l1.9-1.1M17.5 8.9l1.9-1.1" />
        </svg>
      </Link>
    </div>
  );
}
