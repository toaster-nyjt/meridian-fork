import { AttributeTypeValue } from "@/store/data-upload.store";
import { useState, useRef, useEffect } from "react";

export const AttributeType: React.FC<{
  type: AttributeTypeValue;
  onChange: (newType: AttributeTypeValue) => void;
}> = ({ type, onChange }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Map of type to display text/icons
  const typeMap: Record<AttributeTypeValue, string> = {
    string: "Abc",
    number: "123",
    link: "://",
    image: "img",
    boolean: "T/F",
    price: "$",
    button: "btn",
    object: "{}",
    array: "[]",
  };

  // Map of type to background color
  const colorMap: Record<AttributeTypeValue, string> = {
    string: "bg-blue-100 text-blue-800",
    number: "bg-green-100 text-green-800",
    link: "bg-yellow-100 text-yellow-800",
    image: "bg-teal-100 text-teal-800",
    boolean: "bg-purple-100 text-purple-800",
    price: "bg-orange-100 text-orange-800",
    button: "bg-red-100 text-red-800",
    object: "bg-zinc-100 text-zinc-800",
    array: "bg-slate-100 text-slate-800",
  };

  // Available types for selection
  const availableTypes: AttributeTypeValue[] = [
    "string",
    "number",
    "link",
    "image",
    "boolean",
    "price",
    "button",
    "object",
    "array",
  ];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTypeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleTypeSelect = (
    newType: AttributeTypeValue,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onChange(newType);
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`w-[40px] flex items-center justify-center rounded-md px-2 py-1 font-mono text-xs font-medium ${colorMap[type]} hover:opacity-40 transition cursor-pointer `}
        onClick={handleTypeClick}
      >
        {typeMap[type]}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 z-10 bg-white rounded-md shadow-lg border border-gray-200">
          {availableTypes.map((typeOption) => (
            <div
              key={typeOption}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                type === typeOption ? "bg-gray-50" : ""
              }`}
              onClick={(e) => handleTypeSelect(typeOption, e)}
            >
              <div
                className={`w-[40px] flex items-center justify-center rounded-md px-2 py-1 font-mono text-xs font-medium ${colorMap[typeOption]}`}
              >
                {typeMap[typeOption]}
              </div>
              <span className="text-sm">{typeOption}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
