"use client";

import { formatLong } from "@/lib/date";
import CoreChecklist from "./CoreChecklist";
import UpsideChecklist from "./UpsideChecklist";
import NumberInputs from "./NumberInputs";
import JournalField from "./JournalField";
import SaveBar from "./SaveBar";
import { useEntry } from "./useEntry";

interface Props {
  date: string;
  heading: string;
}

export default function EntryForm({ date, heading }: Props) {
  const { draft, status, update, retry } = useEntry(date);
  const loading = status === "loading";

  return (
    <div className={`flex flex-col gap-4 transition-opacity ${loading ? "opacity-60" : ""}`}>
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{heading}</h1>
          <p className="text-ink-soft">{formatLong(date)}</p>
        </div>
        <SaveBar status={status} onRetry={retry} />
      </header>

      <fieldset disabled={loading} className="contents">
        <CoreChecklist draft={draft} onChange={update} />
        <UpsideChecklist draft={draft} onChange={update} />
        <NumberInputs draft={draft} onChange={update} />
        <JournalField value={draft.note} onChange={(note) => update({ note })} />
      </fieldset>
    </div>
  );
}
