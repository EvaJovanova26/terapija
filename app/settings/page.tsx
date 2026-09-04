import Link from "next/link";
import ItemsEditor from "@/components/settings/ItemsEditor";
import SettingsBlock from "@/components/settings/SettingsBlock";

export const metadata = { title: "Items · grow" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-3">
      <Link href="/" className="py-1 text-sm font-semibold text-pink-700">
        ‹ Today
      </Link>
      <h1 className="font-display text-[26px] font-semibold text-ink">Items</h1>
      <ItemsEditor />
      <SettingsBlock />
      <p className="px-2 text-xs leading-relaxed text-ink-faint">Drag the dotted handle to reorder. Tap an item to rename it, change its points, retire or delete it. Retired items stay on the days you already logged them.</p>
    </div>
  );
}
