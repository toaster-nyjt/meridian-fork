import { useStyleStore } from "@/store/style.store";
import { useEffect, useState } from "react";

export const AttributeStyleView = () => {
  const { selectedType, selectedId, attributeStyles, setAttributeStyle } =
    useStyleStore();

  // State for style properties
  const [styles, setStyles] = useState({
    backgroundColor: "#ffffff",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#000000",
    borderRadius: "0px",
    fontSize: "16px",
    fontWeight: "normal",
    fontStyle: "normal",
    color: "#000000",
    textAlign: "left",
  });

  useEffect(() => {
    if (selectedType === "attribute" && selectedId) {
      // Get the current styles from the store
      const currentStyles = attributeStyles[selectedId];
      if (currentStyles) {
        setStyles({
          ...styles,
          ...currentStyles,
        });
      }
    }
    console.log(selectedId, attributeStyles);
  }, [selectedType, selectedId, attributeStyles]);

  const handleStyleChange = (property: string, value: string) => {
    const updatedStyles = {
      ...styles,
      [property]: value,
    };

    setStyles(updatedStyles);

    // Update the style in the store
    if (selectedType === "attribute" && selectedId) {
      setAttributeStyle(selectedId, updatedStyles);
    }
  };

  return (
    <div className="w-full h-full bg-white">
      {selectedType === "attribute" && selectedId && (
        <div className="style-panel p-4 overflow-y-auto h-full">
          <div className="style-section mb-4 border-b pb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Fill</h3>
            <div className="color-picker flex items-center gap-2">
              <label className="text-xs text-gray-500 w-24">Background</label>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="color"
                  value={styles.backgroundColor}
                  onChange={(e) =>
                    handleStyleChange("backgroundColor", e.target.value)
                  }
                  className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={styles.backgroundColor}
                  onChange={(e) =>
                    handleStyleChange("backgroundColor", e.target.value)
                  }
                  className="flex-1 text-xs p-1 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          <div className="style-section mb-4 border-b pb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Border</h3>
            <div className="border-controls space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 w-24">Width</label>
                <input
                  type="text"
                  value={styles.borderWidth}
                  onChange={(e) =>
                    handleStyleChange("borderWidth", e.target.value)
                  }
                  className="flex-1 text-xs p-1 border border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 w-24">Style</label>
                <select
                  value={styles.borderStyle}
                  onChange={(e) =>
                    handleStyleChange("borderStyle", e.target.value)
                  }
                  className="flex-1 text-xs p-1 border border-gray-300 rounded bg-white"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 w-24">Color</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="color"
                    value={styles.borderColor}
                    onChange={(e) =>
                      handleStyleChange("borderColor", e.target.value)
                    }
                    className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.borderColor}
                    onChange={(e) =>
                      handleStyleChange("borderColor", e.target.value)
                    }
                    className="flex-1 text-xs p-1 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="style-section mb-4 border-b pb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Border Radius
            </h3>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-24">Radius</label>
              <input
                type="text"
                value={styles.borderRadius}
                onChange={(e) =>
                  handleStyleChange("borderRadius", e.target.value)
                }
                className="flex-1 text-xs p-1 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="style-section mb-4 border-b pb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Typography
            </h3>
            <div className="typography-controls space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 w-24">Font Size</label>
                <input
                  type="text"
                  value={styles.fontSize}
                  onChange={(e) =>
                    handleStyleChange("fontSize", e.target.value)
                  }
                  className="flex-1 text-xs p-1 border border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 w-24">Format</label>
                <div className="text-formatting flex gap-1 flex-1">
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      styles.fontWeight === "bold"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    onClick={() =>
                      handleStyleChange(
                        "fontWeight",
                        styles.fontWeight === "bold" ? "normal" : "bold"
                      )
                    }
                  >
                    <b>B</b>
                  </button>
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      styles.fontStyle === "italic"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    onClick={() =>
                      handleStyleChange(
                        "fontStyle",
                        styles.fontStyle === "italic" ? "normal" : "italic"
                      )
                    }
                  >
                    <i className="font-serif">I</i>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 w-24">Color</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="color"
                    value={styles.color}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.color}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    className="flex-1 text-xs p-1 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="style-section mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Alignment
            </h3>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-24">Text Align</label>
              <div className="alignment-controls flex gap-1 flex-1">
                <button
                  className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded ${
                    styles.textAlign === "left"
                      ? "bg-[#D7F2E1] text-[#314D3B]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => handleStyleChange("textAlign", "left")}
                >
                  L
                </button>
                <button
                  className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded ${
                    styles.textAlign === "center"
                      ? "bg-[#D7F2E1] text-[#314D3B]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => handleStyleChange("textAlign", "center")}
                >
                  C
                </button>
                <button
                  className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded ${
                    styles.textAlign === "right"
                      ? "bg-[#D7F2E1] text-[#314D3B]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => handleStyleChange("textAlign", "right")}
                >
                  R
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
