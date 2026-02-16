import React from "react";

interface SemZoomItem {
  id: string;
  content: string;
}

export const MalleabilitySemZoom = ({
  zoomLevel,
  setZoomLevel,
  attributes,
  setAttributes,
  shownAttributes,
}: {
  zoomLevel: number;
  setZoomLevel: (zoomLevel: number) => void;
  attributes: string[];
  setAttributes: (attributes: string[]) => void;
  shownAttributes: string[];
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomLevel(Number(e.target.value));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("text/plain"));

    if (dragIndex === dropIndex) return;

    const newAttributes = [...attributes];
    const [draggedItem] = newAttributes.splice(dragIndex, 1);
    newAttributes.splice(dropIndex, 0, draggedItem);
    setAttributes(newAttributes.toReversed());
  };

  return (
    <div className="absolute bottom-0 left-0 flex flex-row gap-4 p-4 bg-zinc-100 m-4 rounded-lg">
      {/* Vertical Slider */}
      <div className="h-[210px] w-[30px] flex items-center justify-center relative">
        <input
          type="range"
          min="0"
          max={attributes.length - 1}
          step="0.01"
          value={zoomLevel}
          onChange={handleSliderChange}
          className="absolute w-[210px] origin-center -rotate-[-90deg] appearance-none bg-transparent 
            [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:rounded-full
            [&::-webkit-slider-runnable-track]:bg-gradient-to-r [&::-webkit-slider-runnable-track]:from-zinc-400 [&::-webkit-slider-runnable-track]:to-zinc-200
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-3 
            [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-zinc-400 [&::-webkit-slider-thumb]:mt-[-7px] 
            hover:[&::-webkit-slider-thumb]:bg-zinc-500
            [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 
            [&::-webkit-slider-thumb]:shadow-sm"
        />
      </div>

      {/* Draggable List */}
      <div className="min-h-[12rem] w-36">
        {attributes.map((attribute, index) => (
          <div
            key={attribute}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`px-3 py-1 mb-2 bg-white rounded-md transition-all text-sm cursor-move hover:bg-gray-50 ${
              shownAttributes.includes(attribute)
                ? "opacity-100 shadow-md"
                : "opacity-50"
            }`}
          >
            {attribute}
          </div>
        ))}
      </div>
    </div>
  );
};
