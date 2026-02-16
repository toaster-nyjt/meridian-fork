import { defaultMalleabilityDimension } from "../../../../../src/renderer/renderer.defaults";
import { MalleableDimension } from "../../../../../src/spec/spec";
import { SettingComponent } from "./setting-component";
import { useODI } from "meridian-ui";

export const SettingsMalleability = () => {
  const { odi, setODI } = useODI();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <div className="text-sm font-semibold">Malleability Features</div>
        <button className="text-sm italic">hide</button>
      </div>
      <div className="relative mx-2 px-2 py-4 flex flex-col gap-4 bg-white rounded">
        <div className="mx-2 flex items-center gap-2">
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
          className={`flex flex-col gap-2 ${
            odi?.malleability?.disabled ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {(["content", "composition", "layout"] as MalleableDimension[]).map(
            (dimension) => {
              const malleabilityOption = odi?.malleability?.[dimension];
              return (
                <div key={dimension} className="mx-2 flex gap-2">
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
