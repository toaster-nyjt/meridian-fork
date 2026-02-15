import {
  getAttributesByRole,
  getAttributesWithoutRoles,
} from "@meridian-ui/meridian";
import { DetailViewConfig } from "@meridian-ui/meridian";
import { FetchedItemType } from "@meridian-ui/meridian";
import { useODI } from "@meridian-ui/meridian";
import { Attribute } from "@meridian-ui/meridian";
import { isAttributeType } from "@meridian-ui/meridian";

export interface DetailPlayer extends DetailViewConfig {
  type: "player";
}

export const DetailPlayer = ({
  // details,
  item,
}: {
  // details: Detail[];
  item: FetchedItemType | undefined;
}) => {
  const { selectedItemEntity } = useODI();

  console.log("item", item, selectedItemEntity);

  if (!item || !selectedItemEntity) {
    return <div></div>;
  } else {
    const { data } = useODI();
    const teamLogo = Array.isArray(item.internalAttributes)
      ? item.internalAttributes.find((attr: any) => attr?.id === "team")
          ?.value === "1"
        ? data.team1["teamLogo"]
        : data.team2["teamLogo"]
      : data.team1["teamLogo"]; // Default fallback if internalAttributes is not an array

    const unlabeledAttributes = getAttributesWithoutRoles(item, false) ?? [];

    return (
      <div key={item.itemId} className="w-full">
        <div className=" flex flex-col justify-center items-center w-full bg-green-600 z-0">
          <div className="w-full p-6 flex flex-col items-center gap-2">
            <div className="relative w-[42px] h-[42px]">
              <Attribute
                options={selectedItemEntity.options}
                attribute={getAttributesByRole(item, "number")}
              />
            </div>
            <div className="flex flex-row gap-1">
              <Attribute
                className="text-white text-xl whitespace-nowrap w-full flex"
                options={selectedItemEntity.options}
                attribute={getAttributesByRole(item, "fullname")}
              />
            </div>
            <div className="w-full flex gap-3">
              <div className="w-full h-[1px] bg-white/30 mt-[8px]" />
              <img
                src={teamLogo}
                className="w-[18px] h-[18px]"
                alt="team-logo"
              />
              <div className="w-full h-[1px] bg-white/30 mt-[8px]" />
            </div>
            <div className="w-full justify-center flex flex-row gap-8">
              <Attribute
                className="text-white text-sm whitespace-nowrap w-full flex"
                options={selectedItemEntity.options}
                attribute={getAttributesByRole(item, "about")}
              />
            </div>
            <div className="w-full justify-center flex flex-row mt-2 gap-x-3 gap-y-1 flex-wrap">
              <Attribute
                className="text-white text-xs font-bold whitespace-nowrap w-full flex"
                options={selectedItemEntity.options}
                attribute={getAttributesByRole(item, "description")}
                showLabel={true}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-sm text-gray-400 my-3">
            ESTADISTICAS DE PARTIDO
          </div>
          {getAttributesByRole(item, "stats")?.map((attr, idx) => (
            <div
              className="w-full flex flex-row gap-2 border-b border-gray-200"
              key={idx}
            >
              <div className="font-bold my-2 mx-5 w-[80px]">{attr?.label}</div>
              <div className="flex flex-row justify-start items-center w-full">
                {attr && !isAttributeType(attr) ? (
                  attr.attributes
                    .filter(
                      (a) =>
                        isAttributeType(a) &&
                        a.value !== undefined &&
                        a.value !== null
                    )
                    .map((a, key) => (
                      <div className="flex flex-1 items-center gap-2" key={key}>
                        <span className="text-xs text-gray-400">
                          {a?.label}
                        </span>
                        <Attribute
                          className="flex flex-row items-center"
                          options={selectedItemEntity.options}
                          attribute={a}
                        />
                      </div>
                    ))
                ) : (
                  <Attribute
                    className="flex-1  bg-red-200 border"
                    options={selectedItemEntity.options}
                    attribute={attr}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3">
          <div className="main-area">
            {/* Main Content Section */}
            <div className="content-area">
              {/* Tags */}
              <div className="fl g-2 sm">
                <Attribute
                  options={selectedItemEntity.options}
                  attribute={getAttributesByRole(item, "tag")}
                />
              </div>
              {/* Action Links */}
              <div className="fl g-2 sm">
                <Attribute
                  options={selectedItemEntity.options}
                  attribute={getAttributesByRole(item, "action")}
                />
                <Attribute
                  options={selectedItemEntity.options}
                  attribute={getAttributesByRole(item, "link")}
                />
              </div>
            </div>

            {/* Footer */}
            <Attribute
              options={selectedItemEntity.options}
              attribute={getAttributesByRole(item, "footer")}
            />
            {/* Badge */}
            <Attribute
              className="badge"
              options={selectedItemEntity.options}
              attribute={getAttributesByRole(item, "badge")}
            />
          </div>
        </div>
        {/* Unlabeled Attributes (Supplementary Content) */}
        {/* {unlabeledAttributes.length > 0 && (
          <div className="fl g-2">
            {unlabeledAttributes.map((attr, idx) => (
              <Attribute
                key={idx}
                options={selectedItemEntity.options}
                attribute={attr}
              />
            ))}
          </div>
        )} */}
      </div>
    );
  }
};
