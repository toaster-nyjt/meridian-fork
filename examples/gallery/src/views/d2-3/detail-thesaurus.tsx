import {
  getAttributesByRole,
  getAttributesWithoutRoles,
  getRoles,
} from "meridian-ui";
import { DetailViewConfig, Role } from "meridian-ui";
import { FetchedItemType } from "meridian-ui";
import { useODI } from "meridian-ui";
import { Attribute } from "meridian-ui";
import { useCallback, useEffect, useState } from "react";
import { MalleabilitySemZoom } from "@/app/d2-3/[id]/malleability-semzoom";

export interface DetailThesaurus extends DetailViewConfig {
  type: "thesaurus";
}

export const DetailThesaurus = ({
  // details,
  item,
}: {
  // details: Detail[];
  item: FetchedItemType | undefined;
}) => {
  const { odi, setODI, selectedItemEntity } = useODI();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [originalShownAttributes, setOriginalShownAttributes] = useState<
    string[]
  >(item ? getRoles([item]) : []);
  const [attributeOrder, setAttributeOrder] = useState([
    // 'spec',
    "sentence",
    "definition",
    "as-in",
    "subtitle",
    "key-attribute",
    "relevance",
  ]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      setZoomLevel((prev) => Math.max(prev + e.deltaY / 300, 1));
    }
  }, []);

  useEffect(() => {
    // Prevent parent scrolling when zooming
    const preventParentScroll = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", preventParentScroll, { passive: false });

    return () => {
      document.removeEventListener("wheel", preventParentScroll);
    };
  }, []);

  useEffect(() => {
    const shownAttributes = (odi?.detailViews?.at(0)?.overviews?.at(0) as any)
      ?.shownAttributes;
    const overview = selectedItemEntity?.detail.overviews?.at(0);
    if (shownAttributes && overview && typeof overview === "object") {
      // Define the attribute order from least to most important

      // Start with the most important attributes (last two) and add more as zoom level increases
      const numAttributesToShow = Math.min(
        1 + zoomLevel,
        attributeOrder.length
      );
      const attributesToShow = attributeOrder.slice(-numAttributesToShow);

      overview.shownAttributes = attributesToShow;
      setODI({
        ...odi,
        detailViews: [
          {
            ...odi?.detailViews?.at(0),
            type: odi?.detailViews?.at(0)?.type || "basic",
            overviews: [overview],
          },
        ],
      });
    }
  }, [zoomLevel, attributeOrder]);

  if (!selectedItemEntity || !item) {
    return <div></div>;
  } else {
    const unlabeledAttributes = getAttributesWithoutRoles(item, true) ?? [];

    // console.log(item, getAttributesByRole(item, 'thumbnail'));
    // console.log(odi, item);
    return (
      <div
        key={item.itemId}
        className="detail-view max-w-[760px]"
        onWheel={handleWheel}
      >
        <MalleabilitySemZoom
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          attributes={attributeOrder.toReversed()}
          setAttributes={setAttributeOrder}
          shownAttributes={
            (odi?.detailViews?.at(0)?.overviews?.at(0) as any)?.shownAttributes
          }
        />
        {/* <div className="w-full py-4 px-6 border-2 border-gray-300 rounded-lg flex flex-col gap-2">
          <div className="">Zoom Level: {zoomLevel.toFixed(1)}</div>
          <div className="flex gap-2 w-fit font-mono text-orange-500 bg-orange-100 px-2 py-1 rounded-md text-sm">
            shownAttributes:
            <span>
              [
              {(
                odi?.detailViews?.at(0)?.overviews?.at(0) as any
              )?.shownAttributes.join(', ')}
              ]
            </span>
          </div>
        </div> */}
        <div className="row">
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
              <div className="flex flex-row gap-2 items-end">
                {["title", "subtitle"].map(
                  (role) =>
                    getAttributesByRole(item, role as Role) && (
                      <Attribute
                        key={role}
                        className={
                          role === "title"
                            ? "text-[42px] font-[600] font-serif"
                            : role === "subtitle"
                            ? "text-[32px] text-slate-500 font-[600] font-serif"
                            : ""
                        }
                        options={selectedItemEntity.options}
                        attribute={getAttributesByRole(item, role as Role)}
                      />
                    )
                )}
              </div>
              <div className="flex flex-col gap-2 items-start">
                <span className="font-bold text-lg flex flex-row gap-1 ">
                  as in
                  <Attribute
                    className="italic"
                    options={selectedItemEntity.options}
                    attribute={getAttributesByRole(item, "as-in")}
                  />
                </span>
                <Attribute
                  className="text-lg"
                  options={selectedItemEntity.options}
                  attribute={getAttributesByRole(item, "definition")}
                />
                <Attribute
                  className="text-lg text-gray-400"
                  options={selectedItemEntity.options}
                  attribute={getAttributesByRole(item, "sentence")}
                />
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
            {/* Badge */}
            <Attribute
              className="badge"
              options={selectedItemEntity.options}
              attribute={getAttributesByRole(item, "badge")}
            />
          </div>
        </div>
        {/* Unlabeled Attributes (Supplementary Content) */}
      </div>
    );
  }
};
