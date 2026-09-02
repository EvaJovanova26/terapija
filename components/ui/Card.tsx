import type { ReactNode } from "react";

interface Props {
  title?: string;
  hint?: string;
  tone?: "default" | "soft";
  children: ReactNode;
}

export default function Card({ title, hint, tone = "default", children }: Props) {
  const bg = tone === "soft" ? "bg-paper border-dashed" : "bg-card";
  return (
    <section className={`rounded-2xl border border-line p-4 ${bg}`}>
      {title && (
        <header className="mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">{title}</h2>
          {hint && <p className="mt-0.5 text-sm text-ink-faint">{hint}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
