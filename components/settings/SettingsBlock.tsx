import Card from "@/components/ui/Card";

/** Export and sign-out. Lives at the bottom of the garden page. */
export default function SettingsBlock() {
  return (
    <Card title="Settings">
      <div className="flex flex-col gap-2">
        <a
          href="/api/export"
          download="baseline-entries.csv"
          className="flex h-12 items-center justify-center rounded-xl border border-line bg-card text-base font-medium active:bg-moss-100"
        >
          Export all entries (CSV)
        </a>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-xl text-base text-ink-soft active:bg-moss-100"
          >
            Sign out
          </button>
        </form>
      </div>
    </Card>
  );
}
