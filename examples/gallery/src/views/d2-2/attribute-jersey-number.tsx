import {
  FetchedAttributeValueType,
} from "@meridian-ui/meridian";
import { isAttributeType } from "@meridian-ui/meridian";
import { AttributeProps } from "@meridian-ui/meridian";
import { useODI } from "@meridian-ui/meridian";

export const AttributeJerseyNumber = ({
  attribute,
  options,
  item,
}: AttributeProps) => {
  const { data } = useODI();

  if (!attribute || attribute.type !== "jersey-number") return <></>;

  const teamId = (
    item?.internalAttributes?.find(
      (a: any) => a.label === "team"
    ) as FetchedAttributeValueType
  )?.value;
  const teamStyle =
    teamId === "1" ? data.team1.teamStyle : data.team2.teamStyle;

  // Check if attribute value is of the correct type
  if (isAttributeType(attribute)) {
    const jerseyNumber = attribute.value;

    if (jerseyNumber) {
      return (
        <div
          className="inset-0 w-[42px] h-[42px] p-[8px] rounded-full flex items-center justify-center"
          style={{
            background: teamStyle,
          }}
        >
          <div
            className={"w-full h-full rounded-full bg-white flex items-center justify-center flex flex-col items-center justify-center shadow-lg"}
          >
            <div className="relative font-bold">{jerseyNumber}</div>
          </div>
        </div>
      );
    }
  }

  return <></>;
};
