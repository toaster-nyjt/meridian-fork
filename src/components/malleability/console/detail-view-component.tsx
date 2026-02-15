import {
  detailViewTypesMap,
  DetailViewTypeConfig,
  roleTypesMap,
} from "../../../renderer/renderer.defaults";
import {
  DetailViewConfig,
  OpenViewIn,
  OpenViewBy,
  AttributeSelectionScope,
} from "../../../spec/spec";
import { SettingComponent } from "./console-setting";
import { useODI } from "../../../store/odi.store";
import "../malleability.scss";
import "./malleability-console.scss";
import { getDataBindingById } from "../../../helpers/view.helper";
import { idsToRoles, rolesToIds } from "../../../helpers/attribute.helper";

export const SettingsDetailView = () => {
  const { odi, setODI, addNewDetailView } = useODI();

  return (
    <div className="settings-section">
      <div className="settings-header">
        <div className="settings-title">Detail Views</div>
        <button className="settings-hide-button">hide</button>
      </div>
      <div className="settings-content">
        {(
          odi?.overviews
            .flatMap((overview) => overview.detailViews)
            .filter(Boolean) as DetailViewConfig[]
        )?.map((detailView) => (
          <div key={detailView.id} className="settings-card">
            <button
              className="settings-delete-button"
            // onClick={() => removeOverview(overview?.id ?? '')}
            >
              Delete
            </button>
            <div className="settings-row">
              <SettingComponent
                title="Type"
                values={detailView.type}
                options={Object.keys(detailViewTypesMap)}
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
            <div className="settings-row">
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
              values={idsToRoles(
                getDataBindingById(odi, detailView.bindingId).items,
                detailView.openFrom ?? []
              )}
              options={["item", ...Object.keys(roleTypesMap)]}
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
                    const items = getDataBindingById(
                      odi,
                      detailView.bindingId
                    ).items;
                    detailViews[dvIndex] = {
                      ...(detailViews[dvIndex] as DetailViewConfig),
                      openFrom: rolesToIds(
                        items,
                        Array.isArray(value)
                          ? value.at(-1) === "all"
                            ? "all"
                            : value.filter((v) => v !== "all")
                          : (value as AttributeSelectionScope)
                      ),
                    };
                    setODI(updatedODI);
                  }
                }
              }}
            />
            <SettingComponent
              title="Attributes to Show"
              values={idsToRoles(
                getDataBindingById(odi, detailView.bindingId).items,
                detailView.shownAttributes === "all"
                  ? "all"
                  : detailView.shownAttributes ?? []
              )}
              options={["all", ...Object.keys(roleTypesMap)]}
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
                    const items = getDataBindingById(
                      odi,
                      detailView.bindingId
                    ).items;
                    detailViews[dvIndex] = {
                      ...(detailViews[dvIndex] as DetailViewConfig),
                      shownAttributes: rolesToIds(
                        items,
                        Array.isArray(value)
                          ? value.at(-1) === "all"
                            ? "all"
                            : value.filter((v) => v !== "all")
                          : (value as AttributeSelectionScope)
                      ),
                    };
                    setODI(updatedODI);
                  }
                }
              }}
            />
          </div>
        ))}
        <button
          className="settings-add-button"
          onClick={() => {
            addNewDetailView();
          }}
        >
          Add Detail View
        </button>
      </div>
    </div>
  );
};
