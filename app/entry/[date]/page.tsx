import Link from "next/link";
import { notFound } from "next/navigation";
import EntryForm from "@/components/log/EntryForm";
import { isValidDateString } from "@/lib/date";

interface Props {
  params: Promise<{ date: string }>;
}

export default async function EntryPage({ params }: Props) {
  const { date } = await params;
  if (!isValidDateString(date)) notFound();

  return (
    <div className="flex flex-col gap-3">
      <Link href="/calendar" className="text-sm text-ink-soft">
        ← Calendar
      </Link>
      <EntryForm key={date} date={date} heading="Entry" />
    </div>
  );
}
