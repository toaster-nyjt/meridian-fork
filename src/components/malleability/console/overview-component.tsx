import {
  itemViewTypesMap,
  overviewTypesMap,
} from "../../../renderer/renderer.defaults";

import {
  AttributeSelectionScope,
  OverviewConfig,
} from "../../../spec/spec";
import { useODI } from "../../../store/odi.store";
import { SettingComponent } from "./console-setting";
import "../malleability.scss";
import "./malleability-console.scss";
import {
  getRoles,
  idsToRoles,
  rolesToIds,
} from "../../../helpers/attribute.helper";
import { getDataBindingById } from "../../../helpers/view.helper";

export const SettingsOverview = () => {
  const { odi, setODI, addNewOverview, removeOverview } = useODI();

  // Get custom overviews from your application context
  // This is a placeholder - you'll need to adapt this to your actual implementation
  const customOverviews = [{ defaultSpec: {} as OverviewConfig }];

  return (
    <div className="settings-section">
      <div className="settings-header">
        <div className="settings-title">Overviews</div>
        <button className="settings-hide-button">hide</button>
      </div>
      <div className="settings-content">
        {odi?.overviews.map((overview) => (
          <div key={overview.id} className="settings-card">
            <button
              className="settings-delete-button"
              onClick={() => removeOverview(overview?.id ?? "")}
            >
              Delete
            </button>
            <div className="settings-row">
              <SettingComponent
                title="Type"
                values={overview.type}
                options={Object.keys(overviewTypesMap)}
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
              values={idsToRoles(
                getDataBindingById(odi, overview.bindingId).items,
                overview.shownAttributes === "all"
                  ? ["all"]
                  : overview.shownAttributes ?? []
              )}
              options={[
                "all",
                ...getRoles(getDataBindingById(odi, overview.bindingId).items),
              ]}
              // ['all', ...Object.keys(roleTypesMap)])}
              onChange={(newValue) => {
                const updatedODI = { ...odi };
                const overviewIndex = updatedODI.overviews.findIndex(
                  (o) => o.id === overview.id
                );
                if (overviewIndex !== -1) {
                  const items = getDataBindingById(
                    odi,
                    overview.bindingId
                  ).items;
                  updatedODI.overviews[overviewIndex] = {
                    ...updatedODI.overviews[overviewIndex],
                    shownAttributes: rolesToIds(
                      items,
                      Array.isArray(newValue)
                        ? newValue.at(-1) === "all"
                          ? "all"
                          : newValue.filter((v) => v !== "all")
                        : (newValue as AttributeSelectionScope)
                    ),
                  };
                  setODI(updatedODI);
                }
              }}
              mode="multi"
            />
          </div>
        ))}
        <button
          className="settings-add-button"
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
