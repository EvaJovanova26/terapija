import GardenScreen from "@/components/garden/GardenScreen";
import SettingsBlock from "@/components/settings/SettingsBlock";

export const metadata = { title: "Garden · Baseline" };

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <GardenScreen />
      <SettingsBlock />
    </div>
  );
}
