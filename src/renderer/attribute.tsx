import "./attribute.scss";
import { CSSProperties, ReactElement } from "react";
import { useODI } from "../store/odi.store";
import React from "react";
import { getFirstDetail, getFirstOverview } from "./renderer.filter";
import {
  FetchedAttributeType,
  FetchedAttributeGroupType,
  ViewOptions,
} from "../spec/spec.internal";
import { isAttributeType } from "../helpers/spec.helper";
import { attributeTypesMap } from "./renderer.defaults";
import { findDetailViewToOpen } from "../helpers/view.helper";
import { MeridianOverview } from "./renderer";

// export const AttributeOver

export const Attribute = ({
  attribute,
  children,
  options,
  // itemIndex,
  onAction,
  showLabel,
  className,
  style,
}: {
  attribute: FetchedAttributeType | FetchedAttributeType[] | undefined;
  children?: ReactElement;
  showLabel?: boolean;
  options: ViewOptions;
  // itemIndex: number;
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: CSSProperties;
}) => {
  const {
    odi,
    selectedItemEntity,
    setSelectedItemEntity,
    highlightAttributes,
    toggleSelectedAttribute,
    attributeIsSelected,
    setLastSelected,
  } = useODI();

  const viewId =
    (options.viewType === "overview"
      ? options.overview.id ?? (odi ? getFirstOverview(odi).id : "")
      : selectedItemEntity?.detail.id ?? (odi ? getFirstDetail(odi).id : "")) ??
    "";

  if (!attribute) return <></>;

  // const classNameString = `${children.className} ${className}`;
  const classNameString = `${className}`; //${attribute?.className}`;
  const styleObject = { ...style }; //...attribute?.style };

  const AttributeItem = ({
    attribute,
    children,
  }: {
    attribute: FetchedAttributeType;
    children?: ReactElement;
  }) => {
    if (!attribute) return <></>;

    if (children) {
      return children;
    }

    // console.log(
    //   'attribute',
    //   attribute.type,
    //   attribute.type && attributeTypesMap[attribute.type]
    // );

    // Check if the attribute type has a custom renderer in attributeTypesMap
    if (attribute.type && attributeTypesMap[attribute.type]) {
      const AttributeComponent = attributeTypesMap[attribute.type].view;
      return (
        <AttributeComponent
          attribute={attribute}
          options={options}
          item={options.items[attribute.itemIndex ?? 0]}
        />
      );
    }

    // If the attribute is an overview, return the overview component
    if (attribute.type === "overview") {
      console.log("overview", attribute);
      return (
        <MeridianOverview
          overviewIdToShow={attribute.id}
          attribute={attribute as FetchedAttributeGroupType}
        />
      );
    }

    // Default fallback types
    if (!isAttributeType(attribute)) {
      return (
        <div
          // ${attribute?.direction === 'row' ? 'flex-row flex-wrap' : 'flex-col'}
          className={`attribute ${classNameString}`}
          // style={attribute?.style}
        >
          {attribute.attributes
            .filter(
              (a) =>
                a &&
                ((isAttributeType(a) && a.value) ||
                  (!isAttributeType(a) && a.attributes))
            )
            .map((attributeSet, index) => (
              <Attribute
                className={classNameString}
                // style={attributeSet?.style}
                key={index}
                options={options}
                attribute={attributeSet}
              >
                {children}
              </Attribute>
            ))}
        </div>
      );
    } else if (
      attribute.type === "element" ||
      React.isValidElement(attribute.value)
    ) {
      return (
        <div className={classNameString} style={styleObject}>
          {attribute.value as ReactElement}
        </div>
      );
    } else if (attribute.type === "image") {
      return (
        <div
          className={`attribute ${classNameString}`}
          style={{
            ...styleObject,
            overflow: "hidden",
            width: options.overview.type === "table" ? "200px" : "auto",
            padding: options.overview.type === "table" ? "6px" : "0px",
          }}
        >
          <img src={attribute.value?.toString()} />
        </div>
      );
    } else if (attribute.type === "link") {
      return (
        <a
          className={classNameString}
          style={styleObject}
          href={attribute.value?.toString()}
        >
          {attribute.label ?? attribute.value?.toString()}
        </a>
      );
    } else if (attribute.type === "button") {
      return (
        <button
          className={classNameString}
          style={styleObject}
          onClick={onAction}
        >
          {attribute.value?.toString()}
        </button>
      );
    } else {
      return (
        <div className={`${classNameString}`} style={styleObject}>
          {/* {attribute.value?.toString()}: {attribute.id} */}
          {/* {showLabel ? (
            <>
              <div className="attribute-label">{attribute.label}</div>
              <div className="attribute-value">{attribute.value?.toString()}</div>
            </>
          ) : (
            <div className="attribute-value">{attribute.value?.toString()}</div>
          )} */}
          {/* {classNameString} */}
          {attribute.value?.toString()}
        </div>
      );
    }
  };

  const RenderAttribute = ({
    attribute,
    children,
  }: {
    attribute: FetchedAttributeType;
    children?: ReactElement;
  }) => {
    if (!attribute) return <></>;

    const detailToOpen = findDetailViewToOpen(options, odi, attribute);

    // console.log('detailToOpen', detailToOpen);

    const toHighlight =
      highlightAttributes &&
      isAttributeType(attribute) &&
      attribute.type !== "overview";

    return (
      <div
        key={`${attribute.itemIndex}-${attribute.index}-${attribute.id}-render`}
        className={`attribute-render ${
          attributeIsSelected(attribute) ? "attribute-selected" : ""
        } ${toHighlight ? "highlight-attributes" : ""}`}
        style={{
          cursor: detailToOpen || toHighlight ? "pointer" : "auto",
          transition: "opacity ease 0.15s, background ease 0.15s",
        }}
        onClick={(e) => {
          if (toHighlight) {
            e.preventDefault();
            e.stopPropagation();

            // console.log('aa', attribute);
            toggleSelectedAttribute(attribute);
            setLastSelected(
              e.clientX + 20,
              e.clientY + 20,
              options.viewType,
              viewId
            );
          } else if (detailToOpen) {
            const generalItem = options.items.at(attribute.itemIndex ?? 0);
            if (generalItem && !("value" in generalItem)) {
              e.stopPropagation();
              // console.log('test', detailToOpen, options, attribute.itemIndex);
              setSelectedItemEntity(
                detailToOpen,
                generalItem.overviewIndex ?? 0,
                generalItem.itemId,
                {
                  ...options,
                  viewType: "detail",
                  overview: {
                    ...options.overview,
                    detailViews: options.overview.detailViews,
                  },
                },
                { x: e.clientX, y: e.clientY }
              );
            }
            if (detailToOpen.openIn === "new-page") {
              e.stopPropagation();
              // If open in new page, run callback function to route.
              options.onOpenDetailNewPage(
                options.items[attribute.itemIndex ?? 0]
              );
            }
          }
        }}
      >
        {/* {overviewOptions.items.at(0)?.index} */}
        {showLabel &&
        isAttributeType(attribute) &&
        attribute.value !== undefined &&
        attribute.value !== null ? (
          <span
            className={`attribute-item ${classNameString}`}
            style={{
              ...styleObject,
              fontWeight: "300",
            }}
          >
            {attribute.label}:&nbsp;
            <AttributeItem attribute={attribute} children={children} />
          </span>
        ) : (
          <AttributeItem attribute={attribute} children={children} />
        )}
      </div>
    );
  };

  if (Array.isArray(attribute) && attribute.length > 0) {
    return attribute.map((attr, idx) => {
      return (
        <RenderAttribute
          key={`${attr?.itemIndex}-${attr?.index}-${attr?.id}-${idx}`}
          attribute={attr as FetchedAttributeType}
        >
          {children}
        </RenderAttribute>
      );
    });
  } else {
    return (
      <RenderAttribute attribute={attribute as FetchedAttributeType}>
        {children}
      </RenderAttribute>
    );
  }
};
