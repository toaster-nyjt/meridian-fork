import {
  getAttributesByRole,
  getAttributesWithoutRoles,
} from "../../helpers/attribute.helper";
import { DetailViewConfig, Role } from "../../spec/spec";
import { FetchedItemType } from "../../spec/spec.internal";
import { useODI } from "../../store/odi.store";
import { Attribute } from "../../renderer/attribute";
import "./detail-view.scss";

export interface DetailBasic extends DetailViewConfig {
  type: "basic";
}

export const DetailBasic = ({
  // details,
  item,
}: {
  // details: Detail[];
  item: FetchedItemType | undefined;
}) => {
  const { odi, selectedItemEntity } = useODI();

  if (!selectedItemEntity || !item) {
    return <div></div>;
  } else {
    const unlabeledAttributes = getAttributesWithoutRoles(item, true) ?? [];

    // console.log(item, getAttributesByRole(item, 'thumbnail'));
    // console.log(odi, item);
    return (
      <div key={item.itemId} className="detail-view">
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
              {/* Badge */}
              <Attribute
                className="badge"
                options={selectedItemEntity.options}
                attribute={getAttributesByRole(item, "badge")}
              />
            </div>
            {/* Main Content Section */}
            <div className="content-area">
              <div className="header-area">
                {["title", "subtitle", "description", "key-attribute"].map(
                  (role) =>
                    getAttributesByRole(item, role as Role) && (
                      <Attribute
                        key={role}
                        className={
                          role === "title"
                            ? "title"
                            : role === "subtitle"
                            ? "subtitle"
                            : ""
                        }
                        options={selectedItemEntity.options}
                        attribute={getAttributesByRole(item, role as Role)}
                      />
                    )
                )}
              </div>
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
            {/* Specs */}
            <Attribute
              options={selectedItemEntity.options}
              attribute={getAttributesByRole(item, "spec")}
            />
            {/* Footer */}
            <Attribute
              options={selectedItemEntity.options}
              attribute={getAttributesByRole(item, "footer")}
            />
          </div>
        </div>
        {/* Unlabeled Attributes (Supplementary Content) */}
        {unlabeledAttributes.length > 0 && (
          <div className="fl g-2">
            {unlabeledAttributes.map((attr, idx) => (
              <Attribute
                key={idx}
                options={selectedItemEntity.options}
                attribute={attr}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
};
