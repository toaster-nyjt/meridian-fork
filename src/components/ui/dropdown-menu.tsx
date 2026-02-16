import { useEffect, useRef } from "react";
import { toTitleCase } from "../../helpers/utils.helper";

export const DropdownMenu = ({
  items,
  onSelectItem,
  onClickAway,
}: {
  items: string[];
  onSelectItem: (item: string) => void;
  onClickAway: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // State to manage visibility
  // const [isVisible, setIsVisible] = useState(false);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClickAway();
      }
    };

    // Add event listener
    document.addEventListener("mouseup", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-menu-component" ref={dropdownRef}>
      <div
        className="dropdown-menu"
        style={{
          top: 20,
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition"
            onClick={() => {
              onSelectItem(item);
              onClickAway();
            }}
          >
            {toTitleCase(item)}
          </div>
        ))}
      </div>
    </div>
  );
};
