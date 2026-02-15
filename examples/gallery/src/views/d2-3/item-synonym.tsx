import {
  getAttributesByRole,
  getAttributesWithoutRoles,
} from "meridian-ui";
import { Role, ItemViewConfig } from "meridian-ui";
import {
  FetchedAttributeValueType,
  FetchedItemType,
  ViewOptions,
} from "meridian-ui";
import { useODI } from "meridian-ui";
import { Attribute } from "meridian-ui";

export interface ItemSynonymType extends ItemViewConfig {
  type: "synonym";
}

export const ItemSynonym = ({
  options,
  item,
  index,
  className,
  style,
}: {
  options: ViewOptions;
  item: FetchedItemType | undefined;
  index: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  if (!item) return <></>;
  const {} = useODI();

  const unlabeledAttributes = getAttributesWithoutRoles(item) ?? [];

  const relevance = (
    getAttributesByRole(item, "relevance")?.at(0) as FetchedAttributeValueType
  )?.value;

  return (
    <div
      className={`w-fit px-2 py-[2px] text-lg flex justify-center items-center rounded-md ${className}`}
      style={{
        ...style,
        color: relevance > 2 ? "white" : "#a33c00",
        backgroundColor:
          relevance > 2
            ? "#f75b00"
            : relevance === 2
            ? "#fdceaa"
            : relevance === 1
            ? "#fef0e6"
            : "",
      }}
    >
      {/* Main Content Section */}
      <div className="">
        <div className="">
          <div className="column">
            {["subtitle", "title"].map(
              (role) =>
                getAttributesByRole(item, role as Role) && (
                  <div key={role} className="title-area">
                    <Attribute
                      className={
                        role === "title"
                          ? "font-bold"
                          : role === "subtitle"
                          ? "text-sm opacity-60"
                          : ""
                      }
                      options={options}
                      attribute={getAttributesByRole(item, role as Role)}
                    />
                  </div>
                )
            )}
          </div>
          <div className="">
            {["description", "key-attribute"].map(
              (role) =>
                getAttributesByRole(item, role as Role) && (
                  <Attribute
                    key={role}
                    className={"font-bold"}
                    options={options}
                    attribute={getAttributesByRole(item, role as Role)}
                  />
                )
            )}
          </div>
          <div className="flex flex-row gap-1 opacity-70 text-sm italic">
            <Attribute
              key={"as-in"}
              options={options}
              attribute={getAttributesByRole(item, "as-in")}
              showLabel
            />
          </div>
          <div className="flex flex-col gap-1">
            {["definition", "sentence"].map(
              (role) =>
                getAttributesByRole(item, role as Role) && (
                  <Attribute
                    key={role}
                    className={
                      "text-sm " +
                      (role === "sentence" ? "opacity-50 italic" : "")
                    }
                    options={options}
                    attribute={getAttributesByRole(item, role as Role)}
                  />
                )
            )}
          </div>
          {unlabeledAttributes.length > 0 && (
            <div className="fl g-2">
              {unlabeledAttributes.map((attr, idx) => (
                <Attribute key={idx} options={options} attribute={attr} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
