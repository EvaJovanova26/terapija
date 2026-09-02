import Link from "next/link";
import ItemsEditor from "@/components/settings/ItemsEditor";
import SettingsBlock from "@/components/settings/SettingsBlock";

export const metadata = { title: "Settings · Blossom" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/garden" className="text-sm text-ink-soft">
        ← Garden
      </Link>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-ink-soft">Your items. Points are per item, so anything can be worth what you decide.</p>
      <ItemsEditor />
      <SettingsBlock />
    </div>
  );
}
