import {
  FetchedAttributeGroupType,
} from "@meridian-ui/meridian";
import { isAttributeType } from "@meridian-ui/meridian";
import { AttributeProps } from "@meridian-ui/meridian";

export const AttributePriceMonthly = (props: AttributeProps) => {
  const { attribute, options } = props;
  if (!attribute || attribute.type !== "price-monthly") return <></>;

  // Check if attribute value is of the correct type
  if (!isAttributeType(attribute)) {
    const firstCapacity = attribute.attributes.at(0);
    const price = (firstCapacity as FetchedAttributeGroupType)?.attributes.find(
      (attr) => attr?.path?.includes("price")
    );
    const dealPrice = (
      firstCapacity as FetchedAttributeGroupType
    )?.attributes.find((attr) => attr?.path?.includes("dealPrice"));

    if (
      dealPrice &&
      price &&
      isAttributeType(price) &&
      isAttributeType(dealPrice)
    ) {
      return (
        <div className="flex flex-col">
          <span className="text-[11px] font-medium">As low as</span>
          <span className="my-[-4px] text-[22px] font-bold">
            ${Number(dealPrice.value).toFixed(2)}
            <span className="text-[16px]">/mo.</span>
            <span className="mx-1 text-[10px] font-normal line-through">
              ${Number(price.value).toFixed(2)}
            </span>
          </span>
          <span className="text-[10px] text-gray-500">
            with eligible trade-in
          </span>
        </div>
      );
    }
  }

  return <></>;
};
