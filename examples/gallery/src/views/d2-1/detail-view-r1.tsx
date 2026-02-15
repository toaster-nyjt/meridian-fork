import {
  getAttributesByRole,
  getAttributesWithoutRoles,
} from "meridian-ui";
import { DetailViewConfig, Role } from "meridian-ui";
import { FetchedItemType } from "meridian-ui";
import { useODI } from "meridian-ui";
import { Attribute } from "meridian-ui";
// import "meridian-ui/components/detail-views/detail-view.scss";

export interface DetailViewR1Type extends DetailViewConfig {
  type: "r1";
}

export const DetailViewR1 = ({
  // details,
  item,
}: {
  // details: Detail[];
  item: FetchedItemType | undefined;
}) => {
  const { selectedItemEntity } = useODI();

  if (!selectedItemEntity || !item) {
    return <div></div>;
  } else {
    const unlabeledAttributes = getAttributesWithoutRoles(item, true) ?? [];

    console.log(item, getAttributesByRole(item, "features"));
    return (
      <div key={item.itemId} className="detail-view flex flex-row">
        <div className="row g-3">
          <div className="main-area">
            <div className="thumbnail-area">
              {/* Thumbnail */}
              <Attribute
                className="thumbnail"
                options={selectedItemEntity.options}
                attribute={getAttributesByRole(item, "thumbnail")}
              />
              {/* Caption */}
              <Attribute
                options={selectedItemEntity.options}
                attribute={getAttributesByRole(item, "caption")}
              />
            </div>
            {/* Main Content Section */}
            <div className="content-area">
              <div className="w-full flex flex-row justify-between items-end">
                <div className="">
                  {["subtitle", "title"].map(
                    (role) =>
                      getAttributesByRole(item, role as Role) && (
                        <Attribute
                          key={role}
                          className={
                            role === "title"
                              ? "text-md font-bold"
                              : role === "subtitle"
                              ? "text-sm"
                              : ""
                          }
                          options={selectedItemEntity.options}
                          attribute={getAttributesByRole(item, role as Role)}
                        />
                      )
                  )}
                </div>
                <div className="h-fit flex flex-row justify-center items-center gap-1 text-xs">
                  <Attribute
                    className="font-extrabold"
                    options={selectedItemEntity.options}
                    attribute={getAttributesByRole(item, "rating")}
                  />
                  <div className="w-[2px] flex-1 h-[12px] border-l border-gray-500"></div>
                  <Attribute
                    className=""
                    options={selectedItemEntity.options}
                    attribute={getAttributesByRole(item, "reviews")}
                  />
                </div>
              </div>
              <div className="">
                {["description", "key-attribute"].map(
                  (role) =>
                    getAttributesByRole(item, role as Role) && (
                      <Attribute
                        key={role}
                        className="text-sm"
                        options={selectedItemEntity.options}
                        attribute={getAttributesByRole(item, role as Role)}
                      />
                    )
                )}
              </div>
              <div className=" border-b border-gray-200" />
              <div className="text-sm font-semibold">Capacity</div>
              <div className="mt-[-8px] ml-4 flex flex-row gap-4">
                <Attribute
                  className="text-sm"
                  options={selectedItemEntity.options}
                  attribute={getAttributesByRole(item, "capacity")}
                />
              </div>
              {/* Tags */}
              <div className="fl g-2 sm">
                <Attribute
                  options={selectedItemEntity.options}
                  attribute={getAttributesByRole(item, "tag")}
                />
              </div>
            </div>
            {/* Specs */}
            <Attribute
              className="flex flex-col gap-4 text-sm"
              options={selectedItemEntity.options}
              attribute={getAttributesByRole(item, "spec")}
            />
            <div className="mt-4 border-b border-gray-200" />

            {/* Action Links */}
            <div className="fl g-2 sm w-full justify-center">
              <Attribute
                className="bg-blue-900 font-bold text-xs px-6 p-2 rounded-full"
                style={{
                  color: "white",
                }}
                options={selectedItemEntity.options}
                attribute={getAttributesByRole(item, "action")}
              />
              <Attribute
                options={selectedItemEntity.options}
                attribute={getAttributesByRole(item, "link")}
              />
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
        <div></div>
      </div>
    );
  }
};
