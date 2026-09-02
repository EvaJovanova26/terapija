/** Export and sign-out, as a small list. */
export default function SettingsBlock() {
  return (
    <div className="rounded-[22px] border border-line bg-card p-1">
      <a href="/api/export" download="blossom-entries.csv" className="flex h-13 items-center justify-between px-3.5 text-[15px] font-medium text-ink active:bg-pink-100">
        Export CSV <span className="text-ink-faint">›</span>
      </a>
      <div className="mx-3.5 h-px bg-line" />
      <form action="/auth/signout" method="post">
        <button type="submit" className="flex h-13 w-full items-center justify-between px-3.5 text-[15px] font-medium text-ink-soft active:bg-pink-100">
          Sign out <span className="text-ink-faint">›</span>
        </button>
      </form>
    </div>
  );
}
