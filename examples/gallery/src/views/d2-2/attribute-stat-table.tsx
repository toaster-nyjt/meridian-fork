

import { isAttributeType } from "meridian-ui";
import { AttributeProps } from "meridian-ui";
import { useODI } from "meridian-ui";

export const AttributeJerseyNumber = ({
  attribute,
  options,
  item,
}: AttributeProps) => {
  const { data } = useODI();

  if (!attribute || attribute.type !== "stats-table") return <></>;

  const teamId = item?.internalAttributes?.find(
    (a: any) => a.id === "team"
  )?.value;
  const teamStyle =
    teamId === "1" ? data.team1.teamStyle : data.team2.teamStyle;

  // Check if attribute value is of the correct type
  if (isAttributeType(attribute)) {
    const jerseyNumber = attribute.value;

    if (jerseyNumber) {
      return (
        <div
          className="inset-0 w-[42px] h-[42px] absolute p-[8px] rounded-full flex items-center justify-center"
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
