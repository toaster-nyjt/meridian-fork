import {
  getAttributesByRole,
  getAttributesWithoutRoles,
} from "meridian-ui";
import { Role, ItemViewConfig } from "meridian-ui";
import {
  FetchedAttributeGroupType,
  FetchedAttributeValueType,
  FetchedItemType,
  ViewOptions,
} from "meridian-ui";
import { useODI } from "meridian-ui";
import { Attribute } from "meridian-ui";
// import "meridian/src/components/item-views/item-view.scss";

export interface ItemViewR1Type extends ItemViewConfig {
  type: "r1";
}

export const ItemViewR1 = ({
  options,
  item,
  index,
}: {
  options: ViewOptions;
  item: FetchedItemType | undefined;
  index: number;
}) => {
  if (!item) return <></>;
  const {} = useODI();

  const unlabeledAttributes = getAttributesWithoutRoles(item) ?? [];

  // console.log('test', getAttributesByRole(item, 'key-attribute'));

  if (
    (
      item.internalAttributes.find(
        (attr) => attr?.id === "type"
      ) as FetchedAttributeValueType
    )?.value === "ad"
  ) {
    return (
      <div
        key={item.itemId}
        className="w-[270px] h-full flex-1 flex flex-col gap-2 justify-center items-center text-center bg-slate-50 rounded-2xl p-4"
      >
        <Attribute
          className="thumbnail max-w-[260px] w-full aspect-[11/12] rounded-lg "
          options={options}
          attribute={getAttributesByRole(item, "thumbnail")}
        />
        <Attribute
          className="text-sm font-[300]"
          options={options}
          attribute={getAttributesByRole(item, "pretitle")}
        />
        <Attribute
          className="text-lg font-bold"
          options={options}
          attribute={getAttributesByRole(item, "title")}
        />
        <Attribute
          className="text-[16px] font-[300]"
          options={options}
          attribute={getAttributesByRole(item, "description")}
        />
        <Attribute
          className="text-[10px] font-[300]"
          options={options}
          attribute={getAttributesByRole(item, "footer")}
        >
          <div className="text-[10px] font-[300] gap-1 text-[#454b52]">
            {(
              getAttributesByRole(item, "footer")?.at(
                0
              ) as FetchedAttributeGroupType
            )?.attributes?.map((attr, idx) => (
              <span
                key={attr?.id}
                className={`${
                  idx === 0
                    ? "font-bold"
                    : idx === 2
                    ? "underline hover:text-[#0057B8] cursor-pointer"
                    : ""
                }`}
              >
                {(attr as FetchedAttributeValueType)?.value?.toString()}
              </span>
            ))}
          </div>
        </Attribute>
      </div>
    );
  }

  return (
    <div className="relative w-[270px] flex-1 flex flex-col gap-2">
      <div className="w-full bg-slate-50 rounded-2xl thumbnail-area aspect-[1/1]">
        {/* Thumbnail */}
        <Attribute
          className="thumbnail"
          options={options}
          attribute={getAttributesByRole(item, "thumbnail")}
        />
        {/* Caption */}
        <Attribute
          options={options}
          attribute={getAttributesByRole(item, "caption")}
        />
      </div>

      {/* Main Content Section */}
      <div className="content-area px-4">
        <div className="header">
          <Attribute
            className="my-2 flex justify-center text-center text-xs font-bold text-[#0057B8]"
            options={options}
            attribute={getAttributesByRole(item, "quick-view")}
          />
          <div className="flex flex-row justify-between">
            <div className="column">
              {["subtitle", "title"].map(
                (role) =>
                  getAttributesByRole(item, role as Role) && (
                    <Attribute
                      key={role}
                      className={
                        role === "title"
                          ? "title font-bold"
                          : role === "subtitle"
                          ? "subtitle"
                          : ""
                      }
                      options={options}
                      attribute={getAttributesByRole(item, role as Role)}
                    />
                  )
              )}
            </div>
            <div className="h-fit flex flex-row justify-center items-center gap-1 text-xs">
              <Attribute
                className="font-extrabold"
                options={options}
                attribute={getAttributesByRole(item, "rating")}
              />
              <div className="w-[2px] flex-1 h-[12px] border-l border-gray-500"></div>
              <Attribute
                className=""
                options={options}
                attribute={getAttributesByRole(item, "reviews")}
              />
            </div>
          </div>

          <Attribute
            className={"sm"}
            options={options}
            attribute={getAttributesByRole(item, "key-attribute")}
          />

          <Attribute
            className={"sm"}
            options={options}
            attribute={getAttributesByRole(item, "description")}
          />

          {/* Unlabeled Attributes (Supplementary Content) */}
          {unlabeledAttributes.length > 0 && (
            <div className="column gap-1 sm">
              {unlabeledAttributes.map((attr, idx) => (
                <Attribute key={idx} options={options} attribute={attr} />
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="fl g-2 sm">
            <Attribute
              options={options}
              attribute={getAttributesByRole(item, "tag")}
            />
          </div>
        </div>

        {/* Specs */}
        <Attribute
          options={options}
          attribute={getAttributesByRole(item, "spec")}
        />

        {/* Footer */}
        <div className="my-1">
          <Attribute
            className="text-xs text-gray-500"
            options={options}
            attribute={getAttributesByRole(item, "footer")}
          />
        </div>

        {/* Actions */}
        <div className="mt-3 flex flex-col gap-1">
          <div className="flex flex-row justify-between g-2">
            <div className="flex flex-row items-center gap-1">
              <input type="checkbox" className="w-6 h-6" id="compare" />
              <label htmlFor="compare" className="ml-1 text-sm">
                Compare
              </label>
            </div>
            <div className="text-red-500">
              <div className="bg-slate-50 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-5 h-5 text-[#0057B8]"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-300 my-2"></div>
          <div className="text-xs font-bold text-[#0057B8] flex flex-row justify-between">
            See device offers
          </div>
        </div>

        <div className="fl g-2 sm">
          <Attribute
            className="bg-blue-900 font-bold text-xs px-6 p-2 rounded-full"
            style={{
              color: "white",
            }}
            options={options}
            attribute={getAttributesByRole(item, "action")}
          />
        </div>
        {/* Badge */}
        <Attribute
          className="absolute top-4 left-4 badge bg-[#baeefc] rounded text-xs underline font-bold px-2 py-1"
          options={options}
          attribute={getAttributesByRole(item, "badge")}
        />
      </div>
    </div>
  );
};
