import { useState, useRef, useEffect } from "react";
import "../malleability.scss";
import "./malleability-console.scss";

interface ODISettingProps {
  title: string;
  values: string | string[];
  options?: string[];
  onChange?: (value: string | string[]) => void;
  mode?: "single" | "multi" | "toggle";
  toggleOptions?: { on: string; off: string };
}

export const SettingComponent = ({
  title,
  values,
  options,
  onChange,
  mode = "single",
  toggleOptions = { on: "on", off: "off" },
}: ODISettingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange(mode === "multi" ? [] : "");
    }
  };

  if (mode === "toggle") {
    return (
      <div className="setting-container">
        <div className="setting-title">{title}</div>
        <div
          className={`setting-toggle-value ${
            values === toggleOptions.on ? "toggle-on" : "toggle-off"
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
    <div className="setting-container setting-dropdown" ref={dropdownRef}>
      <div
        className="setting-title setting-dropdown-title"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <svg
          className={`dropdown-arrow ${isOpen ? "rotate" : ""}`}
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
          onClick={handleClear}
          className="w-4 h-4 hover:bg-zinc-100 rounded-full flex text-xs items-center justify-center text-zinc-100 hover:text-zinc-600"
        >
          Clear
        </button>
      </div>
      <div className="setting-values">
        {mode === "single" ? (
          <div className="setting-value">{values as string}</div>
        ) : (
          (Array.isArray(values) ? values : [values]).map((value, index) => (
            <div key={`${value}-${index}`} className="setting-value">
              {value}
            </div>
          ))
        )}
      </div>

      {isOpen && options && (
        <div className="setting-dropdown-menu">
          {options.map((option) => (
            <div
              key={option}
              className="setting-dropdown-item"
              onClick={() => handleOptionClick(option)}
            >
              {mode === "single" ? (
                // Radio button for single selection
                <div className="setting-radio">
                  {values === option && (
                    <div className="setting-radio-selected" />
                  )}
                </div>
              ) : (
                // Checkbox for multi selection
                <div className="setting-checkbox">
                  {(Array.isArray(values) ? values : [values]).includes(
                    option
                  ) && (
                    <svg
                      className="setting-checkbox-checked"
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
                    ? "selected"
                    : ""
                }`}
              >
                {option}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
