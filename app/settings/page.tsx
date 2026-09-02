import Link from "next/link";
import ItemsEditor from "@/components/settings/ItemsEditor";
import SettingsBlock from "@/components/settings/SettingsBlock";

export const metadata = { title: "Items · Blossom" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-3">
      <Link href="/garden" className="py-1 text-sm font-semibold text-pink-700">
        ‹ Garden
      </Link>
      <h1 className="font-display text-[26px] font-semibold text-ink">Items</h1>
      <ItemsEditor />
      <SettingsBlock />
      <p className="px-2 text-xs leading-relaxed text-ink-faint">Retired items stay on the days you already logged them. Points are per item, so anything can be worth what you decide.</p>
    </div>
  );
}
