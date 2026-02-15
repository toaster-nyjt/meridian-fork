import {
  getAttributesByRole,
  getAttributesWithoutRoles,
} from "@meridian-ui/meridian";
import { Role, ItemViewConfig } from "@meridian-ui/meridian";
import { FetchedItemType, ViewOptions } from "@meridian-ui/meridian";
import { useODI } from "@meridian-ui/meridian";
import { Attribute } from "@meridian-ui/meridian";
import interact from "interactjs";
import { useEffect } from "react";

export interface ItemVerticalType extends ItemViewConfig {
  type: "vertical";
}

export const DMItemVertical = ({
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
  const { itemViewStyle, setItemViewStyle, odi, setODI } = useODI();

  const unlabeledAttributes = getAttributesWithoutRoles(item) ?? [];

  useEffect(() => {
    const element = document.querySelector(".resize");

    if (!element) return;

    const interactable = interact(element as HTMLElement).resizable({
      edges: { left: false, right: true, bottom: true, top: false },
      listeners: {
        move(event) {
          const target = event.target;
          event.stopPropagation();
          event.preventDefault();

          // Calculate scale based on width change
          const initialWidth = 300; // Base width in px
          const newWidth = event.rect.width;
          const scaleRatio = newWidth / initialWidth;

          // Apply scale transformation instead of width/height
          target.style.transform = `scale(${scaleRatio})`;
          target.style.transformOrigin = "top left";

          setItemViewStyle({
            width: "300px", // Keep original width
            height: "auto", // Keep original height
            transform: `scale(${scaleRatio})`,
            // opacity: scaleRatio,
            transformOrigin: "top left",
          });
        },
        end(event) {
          setODI({
            ...odi,
            overviews: odi?.overviews.map((overview) => {
              if (overview.id === options.overview.id) {
                return {
                  ...overview,
                  type: "soccer-field",
                  itemView: {
                    type: "player",
                  },
                };
              } else {
                return overview;
              }
            }),
          });
        },
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 50, height: 50 },
        }),
      ],
    });

    return () => {
      interactable.unset();
    };
  }, []);

  return (
    <div
      className={`resize item-view item-vertical ${className}`}
      style={{ ...style, ...itemViewStyle, userSelect: "none" }}
    >
      <div
        className="thumbnail-area"
        style={{
          transform: itemViewStyle["transform"]
            ? itemViewStyle["transform"].replace(
                /scale\(([^)]+)\)/,
                (match: string, value: string) =>
                  `scale(${1 / parseFloat(value)})`
              )
            : undefined,
        }}
      >
        {/* Thumbnail */}
        <Attribute
          className="thumbnail"
          style={{
            transform: itemViewStyle["transform"]
              ? itemViewStyle["transform"].replace(
                  /scale\(([^)]+)\)/,
                  (match: string, value: string) =>
                    `scale(${1 / parseFloat(value)})`
                )
              : undefined,
          }}
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
          <div className="column">
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
          className="xs"
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
