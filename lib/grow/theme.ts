export type Theme = "day" | "evening";
export type ThemeMode = Theme | "auto";

export const EVENING_FROM = 19;
export const EVENING_UNTIL = 6;

/** Evening from 7pm until 6am on the device clock. */
export function themeForHour(hour: number): Theme {
  return hour >= EVENING_FROM || hour < EVENING_UNTIL ? "evening" : "day";
}

const KEY = "grow.theme";

export function readThemeMode(): ThemeMode {
  try {
    const v = localStorage.getItem(KEY);
    return v === "day" || v === "evening" ? v : "auto";
  } catch {
    return "auto";
  }
}

export function saveThemeMode(mode: ThemeMode) {
  try {
    localStorage.setItem(KEY, mode);
  } catch {}
}

export function resolveTheme(mode: ThemeMode, now = new Date()): Theme {
  return mode === "auto" ? themeForHour(now.getHours()) : mode;
}
