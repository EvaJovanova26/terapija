import GardenPage from "@/components/garden/GardenPage";
import SettingsBlock from "@/components/settings/SettingsBlock";

export const metadata = { title: "Garden · Baseline" };

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <GardenPage />
      <SettingsBlock />
    </div>
  );
}
