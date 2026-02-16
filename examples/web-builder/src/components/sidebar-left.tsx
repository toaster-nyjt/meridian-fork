import { AttributesView } from "./attributes-view/attributes-view";
import { SettingsPanel } from "./settings-view/settings-panel";

export const SidebarLeft = () => {
  return (
    <div className="h-full min-w-[540px] w-[540px] flex flex-col gap-2 p-2 bg-white shadow-2xl overflow-scroll z-10">
      <AttributesView />
      <SettingsPanel />
    </div>
  );
};
