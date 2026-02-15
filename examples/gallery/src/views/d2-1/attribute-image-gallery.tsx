import { AttributeProps } from "@meridian-ui/meridian";
import { isAttributeType } from "@meridian-ui/meridian";
import { useState } from "react";
import { useODI } from "@meridian-ui/meridian";

export const AttributeImageGallery = (props: AttributeProps) => {
  const { attribute, options } = props;
  if (!attribute || attribute.type !== "image-gallery") return <></>;

  const { selectedItemEntity } = useODI();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Check if attribute is a group type with attributes list
  if (isAttributeType(attribute) && Array.isArray(attribute.value)) {
    const selectedValue = attribute.value?.at(selectedColorIndex);
    const selectedImage = selectedValue?.images.at(selectedImageIndex);

    if (selectedImage) {
      return (
        <div
          className={`${
            options.viewType === "overview"
              ? "w-[240px] pt-[60px] aspect-[1/1] justify-start mx-auto container"
              : ""
          } relative rounded-2xl flex flex-col pb-6 items-center gap-4`}
        >
          {options.viewType === "overview" ? (
            <img
              className="max-h-[50%] min-w-[120px] min-h-[136px] object-contain rounded-lg"
              src={selectedImage}
              alt={selectedValue?.name || "Gallery image"}
            />
          ) : (
            <div className="w-full flex flex-col items-center gap-6">
              <div className="w-full flex flex-row items-center justify-between">
                <button
                  className={`m-6 flex items-center justify-center w-[24px] h-[24px] rounded-full border border-[#0057B8] text-[#0057B8] cursor-pointer ${
                    selectedImageIndex === 0
                      ? "border-gray-300 text-gray-300 pointer-events-none"
                      : ""
                  }`}
                  onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 8L10 14L16 20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <img
                  className={"min-w-[120px] min-h-[136px] max-h-[250px] object-contain"}
                  src={selectedImage}
                  alt={selectedValue?.name || "Gallery image"}
                />
                <button
                  className={`m-6 flex items-center justify-center w-[24px] h-[24px] rounded-full border border-[#0057B8] text-[#0057B8] cursor-pointer ${
                    selectedImageIndex === selectedValue?.images.length - 1
                      ? "border-gray-300 text-gray-300 pointer-events-none"
                      : ""
                  }`}
                  onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8L18 14L12 20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-row gap-1">
                {selectedValue?.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="p-1 cursor-pointer"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <div
                      className={`w-[8px] h-[8px] bg-gray-500 rounded-full ${
                        index === selectedImageIndex
                          ? "outline outline-offset-2 outline-[#0057B8]"
                          : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div
            className="flex flex-col gap-2 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs">{selectedValue?.name}</div>
            <div className="flex flex-row justify-center items-center gap-[11px]">
              {attribute.value?.map((value, index) => (
                <div
                  key={index}
                  className={`p-[2px] cursor-pointer outline transition-all duration-300 ${
                    selectedColorIndex === index
                      ? "outline-2 outline-blue-800"
                      : "outline-transparent hover:outline-blue-800"
                  } rounded-full`}
                  onClick={() => setSelectedColorIndex(index)}
                >
                  <div
                    className={`rounded-full outline ${
                      selectedColorIndex === index
                        ? "w-[12px] h-[12px] outline-transparent"
                        : "w-[14px] h-[14px] outline-gray-500"
                    } `}
                    style={{
                      backgroundColor: attribute.value.at(index)?.hex,
                      // index === selectedIndex ? 'white' : 'transparent',
                    }}
                    key={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }

  return <></>;
};
