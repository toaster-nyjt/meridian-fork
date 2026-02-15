import { useODI } from "meridian-ui";
import { useState } from "react";
import { convertFetchedODIToODI } from "meridian-ui";

export const Navbar = () => {
  const { odi } = useODI();
  const [showModal, setShowModal] = useState(false);
  const [specString, setSpecString] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(specString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="flex justify-between px-10 items-center w-full h-[80px] bg-zinc-800">
      <div className="flex items-center gap-2">
        <h1 className="text-white text-xl font-bold">Meridian Web Builder</h1>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-white text-sm font-bold">Preview</button>
        <button
          className="text-white text-sm font-bold"
          onClick={() => {
            if (!odi) return;
            // Convert the FetchedODI to a clean ODI specification
            const cleanODI = convertFetchedODIToODI(odi);

            // Convert to JSON string for display
            const spec = JSON.stringify(cleanODI, null, 2);
            setSpecString(spec);
            setShowModal(true);
          }}
        >
          Export
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Meridian Specification</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="overflow-auto flex-grow relative">
              <pre className="text-xs whitespace-pre-wrap bg-gray-100 p-4 rounded">
                {specString}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-2 py-1 bg-zinc-700 text-white text-xs rounded hover:bg-zinc-600"
                title="Copy to clipboard"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700"
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
