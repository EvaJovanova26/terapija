import Link from "next/link";
import type { RoomState } from "@/lib/grow/rooms";
import type { Avatar } from "@/lib/types";
import AvatarFigure from "@/components/you/AvatarFigure";

interface Props {
  state: RoomState;
  here: boolean;
  avatar: Avatar;
}

/** One stacked room. Placeholder scene until the room symbols arrive. */
export default function RoomCard({ state, here, avatar }: Props) {
  const { room, level, nextAt, points, progress } = state;
  const color = `var(--t-room-${room.domain})`;
  return (
    <Link href={`/home#${room.domain}`} id={room.domain} className="block overflow-hidden rounded-[22px] border border-line bg-card">
      <div className="relative h-40" style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${color} 18%, var(--t-card)) 0%, color-mix(in oklab, ${color} 34%, var(--t-card)) 100%)` }}>
        <svg viewBox="0 0 360 160" className="absolute inset-0 h-full w-full" aria-hidden>
          <rect x="0" y="118" width="360" height="42" fill={color} opacity=".35" />
          {Array.from({ length: level }).map((_, i) => (
            <rect key={i} x={40 + i * 60} y={70 - i * 6} width="40" height={48 + i * 6} rx="8" fill={color} opacity=".55" />
          ))}
        </svg>
        <span className="absolute left-3 top-3 rounded-full px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white" style={{ background: color }}>
          {room.name} · level {level}
        </span>
        {here && <div className="absolute bottom-1 right-4"><AvatarFigure avatar={avatar} size={72} /></div>}
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1">
          <p className="text-xs text-ink-faint">grows with {room.fedBy}</p>
          <p className="text-sm font-semibold text-ink">{nextAt ? `next level at ${nextAt} · ${points} so far` : "fully furnished"}</p>
        </div>
        <div className="h-2 w-20 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full" style={{ width: `${Math.round(progress * 100)}%`, background: color }} />
        </div>
      </div>
    </Link>
  );
}
