/**
 * Local-date helpers. Dates are plain "YYYY-MM-DD" strings built from the
 * device's local calendar, never from toISOString(), so "today" never flips
 * at 00:00 UTC.
 */

export type DateString = string;

const pad = (n: number) => String(n).padStart(2, "0");

export function toDateString(d: Date): DateString {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayLocal(): DateString {
  return toDateString(new Date());
}

/** Parses "YYYY-MM-DD" as a local-midnight Date (not UTC). */
export function parseDate(s: DateString): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isValidDateString(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  return toDateString(parseDate(s)) === s;
}

export function addDays(s: DateString, days: number): DateString {
  const d = parseDate(s);
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

export function addMonths(s: DateString, months: number): DateString {
  const d = parseDate(s);
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  return toDateString(d);
}

/** First day of the month containing `s`. */
export function monthStart(s: DateString): DateString {
  return s.slice(0, 7) + "-01";
}

export function monthEnd(s: DateString): DateString {
  return addDays(addMonths(monthStart(s), 1), -1);
}

/** "YYYY-MM" key for a date string. */
export function monthKey(s: DateString): string {
  return s.slice(0, 7);
}

/** All date strings in the month of `s`, in order. */
export function daysInMonth(s: DateString): DateString[] {
  const out: DateString[] = [];
  let cur = monthStart(s);
  const key = monthKey(s);
  while (monthKey(cur) === key) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

/** 0 = Monday … 6 = Sunday. */
export function weekdayMondayFirst(s: DateString): number {
  return (parseDate(s).getDay() + 6) % 7;
}

export function formatLong(s: DateString): string {
  return parseDate(s).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatMonth(s: DateString): string {
  return parseDate(s).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function isBefore(a: DateString, b: DateString): boolean {
  return a < b; // ISO strings sort lexically
}
