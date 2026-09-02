import Link from "next/link";
import NotesList from "@/components/notes/NotesList";

export const metadata = { title: "Notes · Blossom" };

export default function NotesPage() {
  return (
    <div className="flex flex-col gap-3">
      <Link href="/stats" className="py-1 text-sm font-semibold text-pink-700">
        ‹ Stats
      </Link>
      <h1 className="font-display text-[26px] font-semibold text-ink">Notes</h1>
      <NotesList />
    </div>
  );
}
