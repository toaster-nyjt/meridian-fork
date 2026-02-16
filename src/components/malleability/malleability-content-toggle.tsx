import { useODI } from "../../store/odi.store";

export const MalleabilityAttributesToggle = () => {
  const {
    odi,
    originalOdi,
    setODI,
    highlightAttributes,
    setHighlightAttributes,
  } = useODI();

  if (odi) {
    return (
      <div className="malleability-content-toggle">
        {!odi.malleability?.content?.disabled &&
          odi.malleability?.content?.types?.includes("toggle") && (
            <div className="attributes-toggle">
              {/* <button onClick={() => setODI(originalOdi)}>Reset Customizations</button> */}
              <button
                onClick={() => setHighlightAttributes(!highlightAttributes)}
              >
                {highlightAttributes ? "Off" : "Customize Content"}
              </button>
            </div>
          )}
      </div>
    );
  } else {
    return <></>;
  }
};
