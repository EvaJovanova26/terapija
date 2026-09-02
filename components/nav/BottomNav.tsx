"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Today", d: "M4 6.5h16v14H4zM4 11h16M8 3v4M16 3v4", match: ["/", "/entry"] },
  { href: "/calendar", label: "Calendar", d: "M5 5h14v14H5zM9 10h.01M14 10h.01M9 15h.01M14 15h.01", match: ["/calendar"] },
  { href: "/garden", label: "Garden", d: "M12 21V11M12 11c0-3.5 2-6 5-6 0 4-2 6-5 6zM12 13c0-3.5-2-6-5-6 0 4 2 6 5 6z", match: ["/garden", "/settings"] },
  { href: "/stats", label: "Stats", d: "M5 19V11M12 19V6M19 19v-5", match: ["/stats", "/notes"] },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/login") || pathname.startsWith("/auth")) return null;

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 border-t border-line bg-tabbar/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md px-2 pt-2">
        {TABS.map((tab) => {
          const active = tab.match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
          const color = active ? "text-pink-700" : "text-ink-faint";
          return (
            <li key={tab.href} className="flex-1">
              <Link href={tab.href} className={`flex h-16 flex-col items-center justify-start gap-1.5 pt-1.5 ${color}`}>
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
