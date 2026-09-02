import { NUMBER_FIELDS, SCALE_FIELDS, type Entry, type Item } from "./types";

const FIXED_COLUMNS = ["date", ...NUMBER_FIELDS, "bedtime", ...SCALE_FIELDS, "note", "created_at", "updated_at", "id"] as const;

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = typeof value === "boolean" ? (value ? "true" : "false") : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * All entries, all columns: one column per item (true/false), then the
 * numbers and note. Null numerics export as empty cells, never 0.
 */
export function entriesToCsv(entries: Entry[], items: Item[]): string {
  const header = ["date", ...items.map((i) => i.label), ...FIXED_COLUMNS.slice(1)].join(",");
  const rows = entries.map((e) => {
    const done = new Set(e.done_items);
    const ticks = items.map((i) => cell(done.has(i.id)));
    const rest = FIXED_COLUMNS.slice(1).map((c) => cell(e[c]));
    return [cell(e.date), ...ticks, ...rest].join(",");
  });
  return [header, ...rows].join("\r\n") + "\r\n";
}
