import {
  itemViewTypesMap,
  overviewTypesMap,
  roleTypesMap,
} from "../../../../../src/renderer/renderer.defaults";

import {
  AttributeSelectionScope,
  OverviewConfig,
} from "../../../../../src/spec/spec";
import { useODI } from "meridian-ui";
import { SettingComponent } from "./setting-component";
import { customOverviews } from "@/meridian-views/views.index";
import { useUsageUploadStore } from "@/store/usage-upload.store";

export const SettingsOverview = () => {
  const { odi, setODI, addNewOverview, removeOverview } = useODI();
  const { usageData } = useUsageUploadStore();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <div className="text-sm font-semibold">Overviews</div>
        <button className="text-sm italic">hide</button>
      </div>
      <div className="mx-2 flex flex-col gap-2">
        {odi?.overviews.map((overview) => (
          <div
            key={overview.id}
            className="relative left-0 px-2 py-4 flex flex-col gap-4 bg-white rounded"
          >
            <button
              className="px-2 absolute top-0 right-0 text-xs text-zinc-500 hover:bg-red-300 hover:text-white rounded !transition cursor-pointer"
              onClick={() => removeOverview(overview?.id ?? "")}
            >
              Delete
            </button>
            <div className="flex flex-row justify-start">
              <SettingComponent
                title="Type"
                values={overview.type}
                options={Object.keys(overviewTypesMap)}
                valueUsageMap={usageData?.overviewUsage.type}
                onChange={(newValue) => {
                  const updatedODI = { ...odi };
                  const overviewIndex = updatedODI.overviews.findIndex(
                    (o) => o.id === overview.id
                  );
                  if (overviewIndex !== -1) {
                    updatedODI.overviews[overviewIndex] = {
                      ...updatedODI.overviews[overviewIndex],
                      type: newValue as string,
                    };
                    setODI(updatedODI);
                  }
                }}
              />
              <SettingComponent
                title="Item View Type"
                values={overview.itemView?.type ?? ""}
                options={Object.keys(itemViewTypesMap)}
                valueUsageMap={usageData?.overviewUsage.itemView}
                onChange={(newValue) => {
                  const updatedODI = { ...odi };
                  const overviewIndex = updatedODI.overviews.findIndex(
                    (o) => o.id === overview.id
                  );
                  if (overviewIndex !== -1) {
                    updatedODI.overviews[overviewIndex] = {
                      ...updatedODI.overviews[overviewIndex],
                      itemView: {
                        ...updatedODI.overviews[overviewIndex].itemView,
                        type: newValue as string,
                      },
                    };
                    setODI(updatedODI);
                  }
                }}
              />
            </div>
            <SettingComponent
              title="Detail Views"
              values={
                overview.detailViews
                  ?.map((dv) => (typeof dv === "string" ? dv : dv.id))
                  .filter((id): id is string => !!id) ?? []
              }
              options={odi?.overviews
                .flatMap(
                  (overview) =>
                    overview.detailViews?.map((dv) =>
                      typeof dv === "string" ? dv : dv.id
                    ) ?? []
                )
                .filter((id): id is string => !!id)}
              onChange={(newValue) => {
                const updatedODI = { ...odi };
                const overviewIndex = updatedODI.overviews.findIndex(
                  (o) => o.id === overview.id
                );
                if (overviewIndex !== -1) {
                  const detailViews = Array.isArray(newValue)
                    ? newValue
                    : [newValue];
                  updatedODI.overviews[overviewIndex] = {
                    ...updatedODI.overviews[overviewIndex],
                    detailViews: detailViews.map((id) => ({
                      id,
                      type: "basic",
                    })),
                  };
                  setODI(updatedODI);
                }
              }}
              mode="multi"
            />
            <SettingComponent
              title="Attributes to Show"
              values={
                overview.shownAttributes === "all"
                  ? ["all"]
                  : overview.shownAttributes ?? []
              }
              options={["all", ...Object.keys(roleTypesMap)]}
              valueUsageMap={usageData?.rolesUsage}
              onChange={(newValue) => {
                const updatedODI = { ...odi };
                const overviewIndex = updatedODI.overviews.findIndex(
                  (o) => o.id === overview.id
                );
                if (overviewIndex !== -1) {
                  updatedODI.overviews[overviewIndex] = {
                    ...updatedODI.overviews[overviewIndex],
                    shownAttributes: Array.isArray(newValue)
                      ? newValue.at(-1) === "all"
                        ? "all"
                        : newValue.filter((v) => v !== "all")
                      : (newValue as AttributeSelectionScope),
                  };
                  setODI(updatedODI);
                }
              }}
              mode="multi"
            />
          </div>
        ))}
        <button
          className="w-fit text-sm px-3 py-1 bg-white hover:bg-zinc-300 rounded-md cursor-pointer"
          onClick={() =>
            addNewOverview(customOverviews[0]?.defaultSpec as OverviewConfig)
          }
        >
          Add Overview
        </button>
      </div>
    </div>
  );
};
