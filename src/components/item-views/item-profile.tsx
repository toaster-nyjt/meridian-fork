import {
  getAttributesByRole,
  getAttributesWithoutRoles,
} from "../../helpers/attribute.helper";
import { Role, ItemViewConfig } from "../../spec/spec";
import { FetchedItemType, ViewOptions } from "../../spec/spec.internal";
import { useODI } from "../../store/odi.store";
import { Attribute } from "../../renderer/attribute";
import "./item-view.scss";

export interface ItemProfileType extends ItemViewConfig {
  type: "profile";
}

export const ItemProfile = ({
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
  const { odi, setODI } = useODI();

  const unlabeledAttributes = getAttributesWithoutRoles(item) ?? [];

  return (
    <div className={`item-view item-profile ${className}`} style={style}>
      <div className="thumbnail-area">
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
      <div className="content-area">
        <div className="header-area">
          <div className="column">
            {["subtitle", "title"].map(
              (role) =>
                getAttributesByRole(item, role as Role) && (
                  <div key={role} className="title-area">
                    <Attribute
                      className={
                        role === "title"
                          ? "title"
                          : role === "subtitle"
                          ? "subtitle"
                          : ""
                      }
                      options={options}
                      attribute={getAttributesByRole(item, role as Role)}
                    />
                  </div>
                )
            )}
          </div>
          <div className="row">
            {["description", "key-attribute"].map(
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

          {/* Action Links */}
          <Attribute
            className="action fl g-2 sm"
            options={options}
            attribute={getAttributesByRole(item, "action")}
          />
          <Attribute
            className="link fl g-2 sm"
            options={options}
            attribute={getAttributesByRole(item, "link")}
          />
        </div>

        {/* Specs */}
        <div className="specs">
          <Attribute
            className="spec"
            options={options}
            attribute={getAttributesByRole(item, "spec")}
            showLabel={true}
          />
        </div>

        {/* Footer */}
        <Attribute
          options={options}
          attribute={getAttributesByRole(item, "footer")}
        />
      </div>

      {/* Badge */}
      <Attribute
        className="abs-float badge"
        options={options}
        attribute={getAttributesByRole(item, "badge")}
      />
    </div>
  );
};
