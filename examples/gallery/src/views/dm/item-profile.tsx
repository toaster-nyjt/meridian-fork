import {
  getAttributesByRole,
  getAttributesWithoutRoles,
} from "meridian-ui";
import { Role, ItemViewConfig } from "meridian-ui";
import { FetchedItemType, ViewOptions } from "meridian-ui";
import { useODI } from "meridian-ui";
import { Attribute } from "meridian-ui";
import "meridian-ui/styles";
import { useState } from "react";

export interface ItemProfileType extends ItemViewConfig {
  type: "profile";
}

export const DMItemProfile = ({
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

  const [isDraggedOver, setIsDraggedOver] = useState(false);

  return (
    <div
      className={`item-view item-profile  ${
        isDraggedOver ? "drag-over" : ""
      } ${className}`}
      style={style}
      draggable={true}
      onDragOver={(e) => {
        // Prevent default to allow drop
        e.preventDefault();
        // Add visual feedback for drag over
        setIsDraggedOver(true);
      }}
      onDragLeave={(e) => {
        // Remove visual feedback when drag leaves
        setIsDraggedOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        // Remove visual feedback when drop occurs
        setIsDraggedOver(false);

        setODI({
          ...odi,
          overviews: odi?.overviews.map((overview) => {
            if (overview.id === options.overview.id) {
              return {
                ...overview,
                type: "grid",
                itemView: {
                  type: "vertical",
                },
              };
            } else {
              return overview;
            }
          }),
        });
      }}
    >
      <div
        className={`drag-over-indicator ${isDraggedOver ? "drag-over" : ""}`}
      ></div>
      <div
        className={`drag-over-indicator ${isDraggedOver ? "drag-over-2" : ""}`}
      ></div>
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
