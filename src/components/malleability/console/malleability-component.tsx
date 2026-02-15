import { defaultMalleabilityDimension } from "../../../renderer/renderer.defaults";
import { MalleableDimension } from "../../../spec/spec";
import { SettingComponent } from "./console-setting";
import { useODI } from "../../../store/odi.store";
import "../malleability.scss";
import "./malleability-console.scss";

export const SettingsMalleability = () => {
  const { odi, setODI } = useODI();

  return (
    <div className="settings-section">
      <div className="settings-header">
        <div className="settings-title">Malleability Features</div>
        <button className="settings-hide-button">hide</button>
      </div>
      <div className="settings-card">
        <div className="settings-toggle-container">
          <SettingComponent
            title="Toggle all malleability"
            values={odi?.malleability?.disabled ? "disabled" : "enabled"}
            toggleOptions={{ on: "enabled", off: "disabled" }}
            onChange={(value) => {
              const updatedODI = { ...odi };
              if (!updatedODI.malleability) {
                updatedODI.malleability = {};
              }
              updatedODI.malleability.disabled = value === "disabled";
              setODI(updatedODI);
            }}
            mode="toggle"
          />
        </div>
        <div
          className={`settings-dimensions ${odi?.malleability?.disabled ? "disabled" : ""
            }`}
        >
          {(["content", "composition", "layout"] as MalleableDimension[]).map(
            (dimension) => {
              const malleabilityOption = odi?.malleability?.[dimension];
              return (
                <div key={dimension} className="settings-dimension">
                  <SettingComponent
                    title={dimension}
                    values={
                      malleabilityOption?.disabled ? "disabled" : "enabled"
                    }
                    toggleOptions={{ on: "enabled", off: "disabled" }}
                    onChange={(value) => {
                      const updatedODI = { ...odi };
                      if (dimension === "content") {
                        updatedODI.malleability!.content = {
                          ...updatedODI.malleability!.content,
                          disabled: value === "disabled",
                        };
                      } else if (dimension === "composition") {
                        updatedODI.malleability!.composition = {
                          ...updatedODI.malleability!.composition,
                          disabled: value === "disabled",
                        };
                      } else if (dimension === "layout") {
                        updatedODI.malleability!.layout = {
                          ...updatedODI.malleability!.layout,
                          disabled: value === "disabled",
                        };
                      }
                      setODI(updatedODI);
                    }}
                    mode="toggle"
                  />
                  <SettingComponent
                    title="Feature Types"
                    values={malleabilityOption?.types ?? []}
                    options={
                      defaultMalleabilityDimension[
                      dimension as keyof typeof defaultMalleabilityDimension
                      ]
                    }
                    mode="multi"
                    onChange={(newValue) => {
                      const updatedODI = { ...odi };
                      if (!updatedODI.malleability) return;
                      const malleabilityDimension =
                        updatedODI.malleability[
                        dimension as keyof typeof updatedODI.malleability
                        ];
                      if (typeof malleabilityDimension === "object") {
                        malleabilityDimension.types = Array.isArray(newValue)
                          ? newValue
                          : ([newValue] as string[]);
                      }
                      setODI(updatedODI);
                    }}
                  />
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
