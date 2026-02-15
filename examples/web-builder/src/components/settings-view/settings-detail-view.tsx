import { useUsageUploadStore } from "@/store/usage-upload.store";
import {
  detailViewTypesMap,
  DetailViewTypeConfig,
  roleTypesMap,
} from "../../../../../src/renderer/renderer.defaults";
import {
  DetailViewConfig,
  OpenViewIn,
  OpenViewBy,
  AttributeSelectionScope,
} from "../../../../../src/spec/spec";
import { SettingComponent } from "./setting-component";
import { useODI } from "meridian-ui";

export const SettingsDetailView = () => {
  const { odi, setODI, addNewDetailView } = useODI();
  const { usageData } = useUsageUploadStore();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <div className="text-sm font-semibold">Detail Views</div>
        <button className="text-sm italic">hide</button>
      </div>
      <div className="mx-2 flex flex-col gap-2">
        {(
          odi?.overviews
            .flatMap((overview) => overview.detailViews)
            .filter(Boolean) as DetailViewConfig[]
        )?.map((detailView) => (
          <div
            key={detailView.id}
            className="relative px-2 py-4 flex flex-col gap-4 bg-white rounded"
          >
            <button
              className="px-2 absolute top-0 right-0 text-xs text-zinc-500 hover:bg-red-300 hover:text-white rounded !transition cursor-pointer"
              // onClick={() => removeOverview(overview?.id ?? '')}
            >
              Delete
            </button>
            <div className="flex flex-row justify-start">
              <SettingComponent
                title="Type"
                values={detailView.type}
                options={Object.keys(detailViewTypesMap)}
                valueUsageMap={usageData?.detailViewUsage.type}
                onChange={(value) => {
                  const updatedODI = { ...odi };
                  if (!updatedODI.overviews) return;
                  const detailViewIndex = updatedODI.overviews.findIndex(
                    (overview) =>
                      overview.detailViews?.some(
                        (dv) =>
                          (typeof dv === "string" ? dv : dv.id) ===
                          detailView.id
                      )
                  );
                  if (detailViewIndex !== -1) {
                    const detailViews =
                      updatedODI.overviews[detailViewIndex].detailViews;
                    const dvIndex =
                      detailViews?.findIndex(
                        (dv) =>
                          (typeof dv === "string" ? dv : dv.id) ===
                          detailView.id
                      ) ?? -1;
                    if (dvIndex !== -1 && detailViews) {
                      detailViews[dvIndex] = {
                        ...(detailViews[dvIndex] as DetailViewConfig),
                        type: value as DetailViewTypeConfig<DetailViewConfig>["type"],
                      };
                      setODI(updatedODI);
                    }
                  }
                }}
              />
            </div>
            <div className="flex flex-row gap-2">
              <SettingComponent
                title="Open in"
                values={detailView.openIn ?? ""}
                options={[
                  "new-page",
                  "side-by-side",
                  "replace",
                  "pop-up",
                  "tooltip",
                ]}
                valueUsageMap={usageData?.detailViewUsage.openIn}
                onChange={(value) => {
                  const updatedODI = { ...odi };
                  if (!updatedODI.overviews) return;
                  const detailViewIndex = updatedODI.overviews.findIndex(
                    (overview) =>
                      overview.detailViews?.some(
                        (dv) =>
                          (typeof dv === "string" ? dv : dv.id) ===
                          detailView.id
                      )
                  );
                  if (detailViewIndex !== -1) {
                    const detailViews =
                      updatedODI.overviews[detailViewIndex].detailViews;
                    const dvIndex =
                      detailViews?.findIndex(
                        (dv) =>
                          (typeof dv === "string" ? dv : dv.id) ===
                          detailView.id
                      ) ?? -1;
                    if (dvIndex !== -1 && detailViews) {
                      detailViews[dvIndex] = {
                        ...(detailViews[dvIndex] as DetailViewConfig),
                        openIn: value as OpenViewIn,
                      };
                      setODI(updatedODI);
                    }
                  }
                }}
              />
              <SettingComponent
                title="Open by"
                values={detailView.openBy ?? ""}
                options={["click", "hover"]}
                valueUsageMap={usageData?.detailViewUsage.openBy}
                onChange={(value) => {
                  const updatedODI = { ...odi };
                  if (!updatedODI.overviews) return;
                  const detailViewIndex = updatedODI.overviews.findIndex(
                    (overview) =>
                      overview.detailViews?.some(
                        (dv) =>
                          (typeof dv === "string" ? dv : dv.id) ===
                          detailView.id
                      )
                  );
                  if (detailViewIndex !== -1) {
                    const detailViews =
                      updatedODI.overviews[detailViewIndex].detailViews;
                    const dvIndex =
                      detailViews?.findIndex(
                        (dv) =>
                          (typeof dv === "string" ? dv : dv.id) ===
                          detailView.id
                      ) ?? -1;
                    if (dvIndex !== -1 && detailViews) {
                      detailViews[dvIndex] = {
                        ...(detailViews[dvIndex] as DetailViewConfig),
                        openBy: value as OpenViewBy,
                      };
                      setODI(updatedODI);
                    }
                  }
                }}
              />
            </div>
            <SettingComponent
              title="Open by selecting the following attributes"
              values={detailView.openFrom ?? []}
              options={["item", ...Object.keys(roleTypesMap)]}
              valueUsageMap={usageData?.detailViewUsage.openFrom}
              mode="multi"
              onChange={(value) => {
                const updatedODI = { ...odi };
                if (!updatedODI.overviews) return;
                const detailViewIndex = updatedODI.overviews.findIndex(
                  (overview) =>
                    overview.detailViews?.some(
                      (dv) =>
                        (typeof dv === "string" ? dv : dv.id) === detailView.id
                    )
                );
                if (detailViewIndex !== -1) {
                  const detailViews =
                    updatedODI.overviews[detailViewIndex].detailViews;
                  const dvIndex =
                    detailViews?.findIndex(
                      (dv) =>
                        (typeof dv === "string" ? dv : dv.id) === detailView.id
                    ) ?? -1;
                  if (dvIndex !== -1 && detailViews) {
                    detailViews[dvIndex] = {
                      ...(detailViews[dvIndex] as DetailViewConfig),
                      openFrom: Array.isArray(value)
                        ? value.at(-1) === "all"
                          ? "all"
                          : value.filter((v) => v !== "all")
                        : (value as AttributeSelectionScope),
                    };
                    setODI(updatedODI);
                  }
                }
              }}
            />
            <SettingComponent
              title="Attributes to Show"
              values={
                detailView.shownAttributes === "all"
                  ? "all"
                  : detailView.shownAttributes ?? []
              }
              options={["all", ...Object.keys(roleTypesMap)]}
              valueUsageMap={usageData?.rolesUsage}
              mode="multi"
              onChange={(value) => {
                const updatedODI = { ...odi };
                if (!updatedODI.overviews) return;
                const detailViewIndex = updatedODI.overviews.findIndex(
                  (overview) =>
                    overview.detailViews?.some(
                      (dv) =>
                        (typeof dv === "string" ? dv : dv.id) === detailView.id
                    )
                );
                if (detailViewIndex !== -1) {
                  const detailViews =
                    updatedODI.overviews[detailViewIndex].detailViews;
                  const dvIndex =
                    detailViews?.findIndex(
                      (dv) =>
                        (typeof dv === "string" ? dv : dv.id) === detailView.id
                    ) ?? -1;
                  if (dvIndex !== -1 && detailViews) {
                    detailViews[dvIndex] = {
                      ...(detailViews[dvIndex] as DetailViewConfig),
                      shownAttributes: Array.isArray(value)
                        ? value.at(-1) === "all"
                          ? "all"
                          : value.filter((v) => v !== "all")
                        : (value as AttributeSelectionScope),
                    };
                    setODI(updatedODI);
                  }
                }
              }}
            />
          </div>
        ))}
        <button
          className="w-fit text-sm px-3 py-1 bg-white hover:bg-zinc-300 rounded-md cursor-pointer"
          onClick={() => {
            // console.log('test');
            // addNewOverview();
            addNewDetailView();
          }}
        >
          Add Detail View
        </button>
      </div>
    </div>
  );
};
