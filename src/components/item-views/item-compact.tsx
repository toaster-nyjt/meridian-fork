import {
  attributeInScope,
  getAttributesByHasRole,
  getAttributesWithoutRoles,
} from "../../helpers/attribute.helper";
import { isAttributeType } from "../../helpers/spec.helper";
import { ItemViewConfig } from "../../spec/spec";
import {
  FetchedAttributeType,
  FetchedItemType,
  ViewOptions,
} from "../../spec/spec.internal";
import { Attribute } from "../../renderer/attribute";
import "./item-view.scss";
export interface ItemCompactType extends ItemViewConfig {
  type: "compact";
}

export const ItemCompact = ({
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

  const shown = options.overview.shownAttributes;
  const labeledAttributes = item.attributes
    .flatMap((a) => getAttributesByHasRole(a, true))
    .filter((a) => attributeInScope(shown, a));

  const unlabeledAttributes = getAttributesWithoutRoles(item) ?? [];

  const sliceMax = Math.min(0, 4 - labeledAttributes.length);

  const CompactAttribute = ({
    attribute,
  }: {
    attribute: FetchedAttributeType;
  }) => (
    <Attribute
      className={`sm
  ${
    isAttributeType(attribute) && attribute.type === "image"
      ? "image"
      : "non-image"
  }`}
      options={options}
      attribute={attribute}
    />
  );

  // console.log(unlabeledAttributes);

  return (
    <div className={`item-compact ${className}`} style={style}>
      {labeledAttributes.map((attribute) => (
        <CompactAttribute key={attribute?.id} attribute={attribute} />
      ))}
      {unlabeledAttributes.slice(0, sliceMax).map((attribute) => (
        <CompactAttribute key={attribute?.id} attribute={attribute} />
      ))}
    </div>
  );
};
