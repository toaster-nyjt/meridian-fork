import { useODI } from "meridian-ui";


import { useState } from "react";



import { SettingsOverview } from "./settings-overview";
import { SettingsDetailView } from "./settings-detail-view";
import { SettingsMalleability } from "./settings-malleability";
import { useDataUploadStore } from "@/store/data-upload.store";
import { useUsageUploadStore } from "@/store/usage-upload.store";
import { UsageSpec } from "@/user-analytics/usage.spec";

export const SettingsPanel = () => {
  const { odi, setODI, addNewOverview, removeOverview } = useODI();
  const { importedUsageData, setImportedUsageData } = useDataUploadStore();
  const { setUsageData, usageData } = useUsageUploadStore();
  const [importUsageError, setImportUsageError] = useState<string | null>(null);

  const handleImportUsageData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          // You might want to add validation here to ensure it matches UsageSpec
          setUsageData(jsonData as UsageSpec);
          setImportedUsageData(true);
          setImportUsageError(null);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          setImportUsageError("Invalid JSON file format");
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  return (
    <div className="flex flex-col gap-4 w-full p-4 bg-zinc-100 rounded-lg text-sm">
      <div className="flex justify-between">
        <div className="w-full flex flex-row items-center justify-between gap-2">
          {/* <div className="px-2 font-bold">–</div> */}
          {/* <div className="px-2 font-bold">+</div> */}
          <div className="font-bold">Meridian Settings</div>
          <div className="flex flex-row gap-1 items-center">
            {usageData && (
              <div className="text-xs text-zinc-400">{usageData?.id}</div>
            )}
            {usageData && (
              <span className="text-xs text-red-500 mt-1">
                {importUsageError}
              </span>
            )}
            <button
              className="text-sm border border-zinc-400 bg-white hover:bg-zinc-200 active:bg-zinc-300 px-2 rounded cursor-pointer transition"
              onClick={handleImportUsageData}
            >
              Import Usage Data
            </button>
          </div>
        </div>
        {/* <button className="text-sm border border-zinc-400 bg-white hover:bg-zinc-200 active:bg-zinc-300 px-2 rounded cursor-pointer transition">
          Upload CSV
        </button> */}
      </div>
      <hr className="border-zinc-400" />
      <div className="flex flex-col gap-6">
        <SettingsOverview />
        <SettingsDetailView />
        <SettingsMalleability />
      </div>
    </div>
  );
};
