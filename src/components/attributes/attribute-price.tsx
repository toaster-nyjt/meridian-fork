import { FetchedAttributeType } from "../../spec/spec.internal";
import { isAttributeType } from "../../helpers/spec.helper";

export const AttributePrice = ({
  attribute,
}: {
  attribute: FetchedAttributeType;
}) => {
  if (!attribute || attribute.type !== "price") return <></>;

  // Check if attribute value is of the correct type
  if (isAttributeType(attribute)) {
    return <div>${attribute.value}</div>;
  }

  return <></>;
};
