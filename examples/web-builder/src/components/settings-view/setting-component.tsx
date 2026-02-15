import { useDataUploadStore } from "@/store/data-upload.store";
import { useState, useRef, useEffect } from "react";
import { useODI } from "meridian-ui";
import { hundredToHex } from "@/helpers/data.helper";

interface ODISettingProps {
  title: string;
  values: string | string[];
  options?: string[];
  onChange?: (value: string | string[]) => void;
  mode?: "single" | "multi" | "toggle";
  toggleOptions?: { on: string; off: string };
  valueUsageMap?: Record<string, number>;
}

export const SettingComponent = ({
  title,
  values,
  options,
  onChange,
  mode = "single",
  toggleOptions = { on: "on", off: "off" },
  valueUsageMap = {}, // Map of value to popularity score
}: ODISettingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { importedUsageData, popularAttributes } = useDataUploadStore();
  const { addDesignSpaceVariations } = useODI();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    if (onChange) {
      if (mode === "toggle") {
        onChange(option === values ? "" : option);
      } else if (mode === "single") {
        onChange(option);
      } else {
        // Multi selection
        const valueArray = Array.isArray(values) ? values : [values];
        if (valueArray.includes(option)) {
          onChange(valueArray.filter((v) => v !== option));
        } else {
          onChange([...valueArray, option]);
        }
      }
    }
    if (mode === "single") {
      setIsOpen(false);
    }
  };

  const handleDesignSpaceClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Create N overview copies with the current variation
    const currentValue =
      mode === "single"
        ? (values as string)
        : mode === "multi"
        ? Array.isArray(values)
          ? values
          : [values]
        : values;

    addDesignSpaceVariations("type", currentValue, options);
  };

  if (mode === "toggle") {
    return (
      <div className="flex-1 px-2 flex flex-col gap-1">
        <div className="w-fit text-sm text-zinc-400">{title}</div>
        <div
          className={`ml-3 min-w-[100px] text-xs w-fit text-center px-3 py-1 rounded font-mono cursor-pointer
            ${
              values === toggleOptions.on
                ? "bg-[#D7F2E1] text-[#314D3B]"
                : "bg-zinc-100 text-zinc-800"
            }`}
          onClick={() =>
            handleOptionClick(
              values === toggleOptions.on ? toggleOptions.off : toggleOptions.on
            )
          }
        >
          {values}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-2 flex flex-col gap-1 relative" ref={dropdownRef}>
      <div
        className="group w-fit text-sm text-zinc-400 cursor-pointer hover:text-zinc-600 flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <svg
          className={`w-3 h-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <button
          className="w-[10px] h-[10px] group-hover:w-[120px] group-hover:h-[20px] rounded-full cursor-pointer
        bg-[#B7D8C4] group-hover:bg-[#628670] active:bg-[#486754]
        transition-all duration-200 text-transparent
        group-hover:text-white font-semibold overflow-hidden"
          onClick={handleDesignSpaceClick}
        >
          Design Space
        </button>
      </div>
      <div className="ml-3 flex flex-wrap gap-2">
        {mode === "single" ? (
          <div
            className={
              "min-w-[100px] text-xs w-fit text-center px-3 py-1 rounded font-mono outline-2 transition duration-500 " +
              (valueUsageMap && valueUsageMap[values as string] !== undefined
                ? `bg-[#F5FDD6] outline-2 outline-[#A9BC58] opacity-${Math.max(
                    30,
                    Math.round(valueUsageMap[values as string] * 100)
                  )}`
                : importedUsageData &&
                  popularAttributes.includes(values as string)
                ? "bg-[#F5FDD6] outline-2 outline-[#A9BC58]"
                : "bg-zinc-100 outline-transparent")
            }
            style={
              valueUsageMap && valueUsageMap[values as string] !== undefined
                ? {
                    // opacity: Math.max(0.3, valueUsageMap[values as string]),
                    backgroundColor: `#F5FDD6${hundredToHex(
                      valueUsageMap[values as string] * 100
                    )}`,
                    outlineColor: `#A9BC58${hundredToHex(
                      valueUsageMap[values as string] * 100
                    )}`,
                    outlineWidth: "2px",
                    outlineStyle: "solid",
                  }
                : {}
            }
          >
            {values as string}
            {valueUsageMap && valueUsageMap[values as string] !== undefined && (
              <span className="ml-2 text-xs text-[#A9BC58]">
                {Math.round(valueUsageMap[values as string] * 100)}%
              </span>
            )}
          </div>
        ) : (
          (Array.isArray(values) ? values : [values]).map((value, index) => (
            <div
              key={`${value}-${index}`}
              className={
                "min-w-[100px] text-xs w-fit text-center px-3 py-1 rounded font-mono outline-2 transition duration-500 " +
                (valueUsageMap && valueUsageMap[value] !== undefined
                  ? "bg-[#F5FDD6] outline-2 outline-[#A9BC58]"
                  : importedUsageData && popularAttributes.includes(value)
                  ? "bg-[#F5FDD6] outline-2 outline-[#A9BC58]"
                  : "bg-zinc-100 outline-transparent")
              }
              style={
                valueUsageMap && valueUsageMap[value] !== undefined
                  ? {
                      // opacity: Math.max(0.3, valueUsageMap[value]),
                      backgroundColor: `#F5FDD6${hundredToHex(
                        valueUsageMap[value] * 100
                      )}`,
                      outlineColor: `#A9BC58${hundredToHex(
                        valueUsageMap[value] * 100
                      )}`,
                      outlineWidth: "2px",
                      outlineStyle: "solid",
                    }
                  : {}
              }
            >
              {value}{" "}
              {valueUsageMap && valueUsageMap[value] !== undefined && (
                <span className="ml-2 text-xs text-[#A9BC58]">
                  {Math.round(valueUsageMap[value] * 100)}%
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {isOpen && options && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1">
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 text-xs hover:bg-gray-100 cursor-pointer flex items-center font-mono"
              onClick={() => handleOptionClick(option)}
            >
              {mode === "single" ? (
                // Radio button for single selection
                <div className="w-4 h-4 rounded-full border border-gray-400 mr-2 flex items-center justify-center">
                  {values === option && (
                    <div className="w-2 h-2 rounded-full bg-[#6BB789]" />
                  )}
                </div>
              ) : (
                // Checkbox for multi selection
                <div className="w-4 h-4 border border-gray-400 mr-2 flex items-center justify-center">
                  {(Array.isArray(values) ? values : [values]).includes(
                    option
                  ) && (
                    <svg
                      className="w-3 h-3 text-[#6BB789]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              )}
              <span
                className={`${
                  (mode === "single" && values === option) ||
                  (mode === "multi" &&
                    (Array.isArray(values) ? values : [values]).includes(
                      option
                    ))
                    ? "font-bold"
                    : ""
                }`}
              >
                {option}
                {/* {JSON.stringify(valueUsageMap)} */}
                {valueUsageMap && valueUsageMap[option] !== undefined && (
                  <span className="ml-2 text-xs text-gray-400">
                    {Math.round(valueUsageMap[option] * 100)}%
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
