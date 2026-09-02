import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="text-xl font-semibold">Nothing here</h1>
      <p className="text-ink-soft">That page doesn&apos;t exist.</p>
      <Link href="/" className="text-pink-700 underline underline-offset-4">
        Back to today
      </Link>
    </div>
  );
}
