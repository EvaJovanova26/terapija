"use client";

import { useEffect } from "react";
import { readThemeMode, resolveTheme } from "@/lib/grow/theme";

/** Sets data-theme on <html> from the device clock (or a saved override). Re-checks every minute. */
export default function ThemeClock() {
  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.theme = resolveTheme(readThemeMode());
    };
    apply();
    const id = setInterval(apply, 60_000);
    window.addEventListener("grow:theme", apply);
    return () => {
      clearInterval(id);
      window.removeEventListener("grow:theme", apply);
    };
  }, []);
  return null;
}
