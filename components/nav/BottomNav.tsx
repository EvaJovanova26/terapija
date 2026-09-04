"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Today", d: "M4 6.5h16v14H4zM4 11h16M8 3v4M16 3v4", match: ["/", "/entry"] },
  { href: "/home", label: "Home", d: "M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6", match: ["/home"] },
  { href: "/tapestry", label: "Tapestry", d: "M5 4h14M5 8h14M5 12h14M5 16h14M5 20h14", match: ["/tapestry", "/calendar"] },
  { href: "/journal", label: "Journal", d: "M6 3h12v18H6zM9 8h6M9 12h6", match: ["/journal", "/notes"] },
  { href: "/you", label: "You", d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0", match: ["/you", "/settings", "/stats"] },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/login") || pathname.startsWith("/auth")) return null;

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 border-t border-line bg-tabbar/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md px-1 pt-2">
        {TABS.map((tab) => {
          const active = tab.match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
          return (
            <li key={tab.href} className="flex-1">
              <Link href={tab.href} className={`flex h-16 flex-col items-center gap-1.5 pt-1.5 ${active ? "text-accent" : "text-ink-faint"}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d={tab.d} />
                </svg>
                <span className="text-[11px] font-semibold leading-none">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
