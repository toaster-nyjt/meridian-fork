import {
  getAttributesByRole,
  getAttributesWithoutRoles,
} from "../../helpers/attribute.helper";
import { Role, ItemViewConfig } from "../../spec/spec";
import { FetchedItemType, ViewOptions } from "../../spec/spec.internal";
import { useODI } from "../../store/odi.store";
import { Attribute } from "../../renderer/attribute";
import "./item-view.scss";
export interface ItemPinType extends ItemViewConfig {
  type: "pin";
}

export const ItemPin = ({
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

  return (
    <div
      className={`item-view item-pin item-profile ${className}`}
      style={style}
    >
      {/* Main Content Section */}
      <div className="">
        <div className="p-1">
          {["key-attribute"].map(
            (role) =>
              getAttributesByRole(item, role as Role) && (
                <Attribute
                  key={role}
                  className={role === "title" ? "f-m lg" : "f-b md"}
                  options={options}
                  attribute={getAttributesByRole(item, role as Role)}
                />
              )
          )}
        </div>
        <div className="col j-c i-c">
          {["title", "subtitle", "description"].map(
            (role) =>
              getAttributesByRole(item, role as Role) && (
                <Attribute
                  key={role}
                  className={"sm"}
                  options={options}
                  attribute={getAttributesByRole(item, role as Role)}
                />
              )
          )}
        </div>

        <div className="">
          {/* Thumbnail */}
          <Attribute
            className=""
            options={options}
            attribute={getAttributesByRole(item, "thumbnail")}
          />
          {/* Caption */}
          <Attribute
            options={options}
            attribute={getAttributesByRole(item, "caption")}
          />
        </div>

        {/* Unlabeled Attributes (Supplementary Content) */}
        {unlabeledAttributes.length > 0 && (
          <div className="col g-1 sm">
            {unlabeledAttributes.map((attr, idx) => (
              <Attribute key={idx} options={options} attribute={attr} />
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="">
          <Attribute
            options={options}
            attribute={getAttributesByRole(item, "tag")}
          />
        </div>

        {/* Action Links */}
        <div className="">
          <Attribute
            options={options}
            attribute={getAttributesByRole(item, "action")}
          />
          <Attribute
            options={options}
            attribute={getAttributesByRole(item, "link")}
          />
        </div>
      </div>

      {/* Specs */}
      <Attribute
        options={options}
        attribute={getAttributesByRole(item, "spec")}
      />

      {/* Footer */}
      <Attribute
        options={options}
        attribute={getAttributesByRole(item, "footer")}
      />

      {/* Badge */}
      <Attribute
        className="abs-float badge"
        options={options}
        attribute={getAttributesByRole(item, "badge")}
      />
    </div>
  );
};
