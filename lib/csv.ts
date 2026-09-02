import { CORE_FIELDS, NUMBER_FIELDS, UPSIDE_FIELDS, type Entry } from "./types";

export const CSV_COLUMNS = [
  "date",
  ...CORE_FIELDS,
  ...UPSIDE_FIELDS,
  ...NUMBER_FIELDS,
  "note",
  "created_at",
  "updated_at",
  "id",
] as const;

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = typeof value === "boolean" ? (value ? "true" : "false") : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** All entries, all columns. Null numerics export as empty cells, never 0. */
export function entriesToCsv(entries: Entry[]): string {
  const header = CSV_COLUMNS.join(",");
  const rows = entries.map((e) => CSV_COLUMNS.map((c) => cell(e[c])).join(","));
  return [header, ...rows].join("\r\n") + "\r\n";
}
