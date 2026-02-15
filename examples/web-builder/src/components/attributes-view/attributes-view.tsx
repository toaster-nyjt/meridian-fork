import { useState, useRef } from "react";
import {
  Attribute,
  useDataUploadStore,
} from "@/store/data-upload.store";
import { useDragStore } from "@/store/drag.store";
import { AttributeDraggable } from "./attribute-draggable";
import { resolveValue } from "meridian-ui";

interface AttributesViewProps {
  initialFileName?: string;
}

export const AttributesView: React.FC<AttributesViewProps> = ({
  initialFileName = "Upload CSV or JSON",
}) => {
  const { attributes, data, file, loading, error, setFile, parseFile } =
    useDataUploadStore();

  const setDraggedItem = useDragStore((state) => state.setDraggedItem);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const handleAttributeClick = (attribute: string): void => {
    setSelectedAttribute(attribute);
    setShowPopup(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const handleUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const closePopup = (): void => {
    setShowPopup(false);
    setSelectedAttribute(null);
  };

  const renderAttributes = (attrs: Attribute[], level = 0) => {
    return attrs.map((item) => (
      <div key={item.path || item.attribute} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            {item.children && Object.keys(item.children).length > 0 && (
              <button
                onClick={() =>
                  setCollapsed((prev) => ({
                    ...prev,
                    [item.path || item.attribute]:
                      !prev[item.path || item.attribute],
                  }))
                }
                className="w-4 h-4 flex items-center justify-center mr-2 hover:bg-zinc-200 rounded"
              >
                {collapsed[item.path || item.attribute] ? "+" : "-"}
              </button>
            )}
            <div className="flex-1">
              <AttributeDraggable
                item={{
                  attribute: item.attribute,
                  type: item.type,
                  value: item.value,
                  path: item.path || item.attribute,
                }}
                handleAttributeClick={() =>
                  handleAttributeClick(item.path || item.attribute)
                }
                indentLevel={level}
              />
            </div>
          </div>
          {item.children &&
            Object.keys(item.children).length > 0 &&
            !collapsed[item.path || item.attribute] && (
              <div className="flex flex-col gap-2 ml-4 border-l border-zinc-300">
                {renderAttributes(Object.values(item.children), level + 1)}
              </div>
            )}
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full max-h-[700px]  flex flex-col gap-4 w-full p-4 bg-zinc-100 rounded-lg">
      <div className="flex justify-between">
        <div className="flex flex-row gap-2 items-end">
          <div className="font-bold">{file ? file.name : initialFileName}</div>
          {data && (
            <div className="mb-[1px] text-sm text-zinc-600">
              {data.length} Items
            </div>
          )}
        </div>
        <button
          onClick={handleUploadClick}
          className="text-sm border border-zinc-400 bg-white hover:bg-zinc-200 active:bg-zinc-300 px-2 rounded cursor-pointer transition"
        >
          Upload File
        </button>
        <input
          type="file"
          accept=".csv,.json"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {loading && (
        <div className="text-center py-4">
          <p>Loading CSV data...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 bg-red-100 p-2 rounded">{error}</div>
      )}

      {attributes.length > 0 && (
        <>
          <hr className="border-zinc-400" />
          <div className="flex flex-col gap-2 overflow-scroll transition">
            {renderAttributes(attributes)}
          </div>
        </>
      )}

      {showPopup && selectedAttribute && (
        <div
          className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-4/5 max-w-4xl max-h-3/4 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center bg-zinc-100 p-4 border-b">
              <h3 className="font-bold">{selectedAttribute} - Data Preview</h3>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left border-b">Row</th>
                    <th className="px-4 py-2 text-left border-b">
                      {selectedAttribute}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {resolveValue(row, selectedAttribute)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-zinc-100 p-4 border-t">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
