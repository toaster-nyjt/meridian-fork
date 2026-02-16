import {
  Attribute,
  AttributeTypeValue,
  useDataUploadStore,
} from "@/store/data-upload.store";
import { useDragStore } from "@/store/drag.store";
import { useCallback } from "react";
import { AttributeType } from "./attribute-type";

interface AttributeDraggableProps {
  item: Attribute;
  handleAttributeClick: (path: string) => void;
  indentLevel?: number;
}

export const AttributeDraggable: React.FC<AttributeDraggableProps> = ({
  item,
  handleAttributeClick,
  indentLevel = 0,
}) => {
  const { updateAttributeType } = useDataUploadStore();
  const { setDraggedItem } = useDragStore(); // Only get what we need

  const handleTypeChange = useCallback(
    (attributeName: string, newType: AttributeTypeValue) => {
      updateAttributeType(attributeName, newType);
    },
    [updateAttributeType]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      // Optional: Set drag image if needed
      // const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      // e.dataTransfer.setDragImage(dragImage, 0, 0);

      setDraggedItem(item);
    },
    [item, setDraggedItem]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, [setDraggedItem]);

  return (
    <div
      className="flex justify-between items-center gap-4 bg-white rounded p-2 cursor-grab hover:bg-zinc-50 transition-all"
      // className={`flex items-center gap-2 p-2 hover:bg-zinc-200 rounded cursor-pointer transition`}
      style={{ marginLeft: `${indentLevel * 16}px` }}
      key={item.attribute}
      draggable
      onClick={() => handleAttributeClick(item.attribute)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <AttributeType
        type={item.type}
        onChange={(newType) => handleTypeChange(item.attribute, newType)}
      />
      <div className="flex-1 text-sm font-semibold">{item.attribute}</div>
      <div className="w-[45%] italic text-sm text-zinc-500 truncate">
        {/* {item.value} */}
        {JSON.stringify(item.value)}
        {/* {JSON.stringify(item.path)} */}
      </div>
    </div>
  );
};
