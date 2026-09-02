import { daysInMonth, weekdayMondayFirst } from "@/lib/date";
import type { Entry } from "@/lib/types";
import DayDot from "./DayDot";

interface Props {
  month: string; // any date in the month, YYYY-MM-DD
  entries: Entry[];
  today: string;
}

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function MonthGrid({ month, entries, today }: Props) {
  const byDate = new Map(entries.map((e) => [e.date, e]));
  const days = daysInMonth(month);
  const leading = weekdayMondayFirst(days[0]);

  return (
    <div className="grid grid-cols-7 gap-x-1 gap-y-2">
      {WEEKDAYS.map((w, i) => (
        <div key={i} className="pb-1 text-center text-[11px] font-semibold text-ink-faint">
          {w}
        </div>
      ))}
      {Array.from({ length: leading }).map((_, i) => (
        <div key={`pad-${i}`} />
      ))}
      {days.map((date) => {
        const entry = byDate.get(date);
        return (
          <DayDot
            key={date}
            date={date}
            dayNumber={Number(date.slice(8))}
            doneCount={entry ? entry.done_items.length : null}
            isToday={date === today}
          />
        );
      })}
    </div>
  );
}
