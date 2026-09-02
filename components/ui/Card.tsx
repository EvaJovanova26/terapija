import type { ReactNode } from "react";

interface Props {
  title?: string;
  meta?: string;
  className?: string;
  children: ReactNode;
}

export default function Card({ title, meta, className = "", children }: Props) {
  return (
    <section className={`rounded-[22px] border border-line bg-card p-4 ${className}`}>
      {title && (
        <header className="mb-3 flex items-baseline justify-between gap-2">
          <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
          {meta && <span className="text-xs font-medium text-ink-faint">{meta}</span>}
        </header>
      )}
      {children}
    </section>
  );
}
