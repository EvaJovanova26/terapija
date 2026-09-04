import { parseDate } from "@/lib/date";
import type { Postcard } from "@/lib/grow/postcards";

interface Props {
  card: Postcard;
}

const monthName = (m: string) => parseDate(m + "-01").toLocaleDateString(undefined, { month: "long", year: "numeric" });

/** Back of the monthly postcard. The painted front arrives with the design. */
export default function PostcardCard({ card }: Props) {
  const facts = [
    `${card.daysLogged} ${card.daysLogged === 1 ? "day" : "days"} logged`,
    `${card.points.toLocaleString()} points`,
    card.topItem ? `most often: ${card.topItem}` : null,
    card.longestRun > 1 ? `longest run: ${card.longestRun} days` : null,
    card.superpowers > 0 ? `${card.superpowers} superpower${card.superpowers === 1 ? "" : "s"}` : null,
  ].filter(Boolean);
  return (
    <article className="rounded-[18px] border border-line bg-[#fffaf2] p-4 text-[#2f2a33] shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="font-display text-lg">{monthName(card.month)}</h3>
        <span className="rounded-sm border border-dashed border-[#c8643a] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#c8643a]">grow</span>
      </div>
      <ul className="mt-3 flex flex-col gap-1 text-sm">
        {facts.map((f) => (
          <li key={f as string}>{f}</li>
        ))}
      </ul>
      {card.noteLine && <p className="mt-3 border-t border-dashed border-[#e6d8c4] pt-3 text-sm italic text-[#6f6672]">“{card.noteLine}”</p>}
    </article>
  );
}
