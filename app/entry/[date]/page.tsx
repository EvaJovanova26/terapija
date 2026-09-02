import { notFound } from "next/navigation";
import EntryForm from "@/components/log/EntryForm";
import { isValidDateString } from "@/lib/date";

interface Props {
  params: Promise<{ date: string }>;
}

export default async function EntryPage({ params }: Props) {
  const { date } = await params;
  if (!isValidDateString(date)) notFound();
  return <EntryForm key={date} date={date} backHref="/calendar" />;
}
