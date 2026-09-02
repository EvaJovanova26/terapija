import Link from "next/link";
import Sym, { VB } from "@/components/art/Sym";

interface Props {
  date: string;
  dayNumber: number;
  /** Number of items ticked; null when the day has no entry. */
  doneCount: number | null;
  isToday: boolean;
}

/**
 * One flower per day. Logged days are full colour; unlogged days are the same
 * bud, just faint. The bloom stage shifts only slightly with how much was logged.
 */
export default function DayDot({ date, dayNumber, doneCount, isToday }: Props) {
  const logged = doneCount !== null;
  const id = !logged || doneCount === 0 ? "f-0" : doneCount >= 8 ? "f-100" : "f-50";
  return (
    <Link
      href={`/entry/${date}`}
      aria-label={date}
      className={`flex h-11 flex-col items-center justify-center rounded-2xl active:bg-pink-100 ${isToday ? "shadow-[inset_0_0_0_2px_#f79ac8]" : ""}`}
    >
      <Sym id={id} vb={VB.flower} width={22} opacity={logged ? 1 : 0.22} />
      <span className="text-[10px] font-semibold leading-none text-ink-faint">{dayNumber}</span>
    </Link>
  );
}
