import Link from "next/link";

interface Props {
  date: string;
  dayNumber: number;
  /** Number of core items logged; null when nothing was logged. */
  coreCount: number | null;
  isToday: boolean;
}

/**
 * One dot per day. Logged days are solid; unlogged days are the same shape,
 * just faint. Opacity shifts only slightly with how much was logged.
 */
export default function DayDot({ date, dayNumber, coreCount, isToday }: Props) {
  const logged = coreCount !== null;
  const opacity = logged ? 0.7 + 0.3 * Math.min(coreCount, 7) / 7 : 0.18;

  return (
    <Link
      href={`/entry/${date}`}
      aria-label={date}
      className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl active:bg-moss-100"
    >
      <span
        className={`h-5 w-5 rounded-full bg-moss-500 ${isToday ? "ring-2 ring-moss-300 ring-offset-2 ring-offset-paper" : ""}`}
        style={{ opacity }}
      />
      <span className="text-[11px] text-ink-faint">{dayNumber}</span>
    </Link>
  );
}
