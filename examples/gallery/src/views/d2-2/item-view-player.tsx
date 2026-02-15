import {
  getAttributesByRole,
  getAttributesWithoutRoles,
} from "@meridian-ui/meridian";
import { ItemViewConfig } from "@meridian-ui/meridian";
import {
  FetchedItemType,
  ViewOptions,
} from "@meridian-ui/meridian";
import { Attribute } from "@meridian-ui/meridian";


export interface ItemPlayerType extends ItemViewConfig {
  type: "player";
}

export const ItemPlayer = ({
  options,
  item,
  index,
  style,
}: {
  options: ViewOptions;
  item: FetchedItemType | undefined;
  index: number;
  style?: React.CSSProperties;
}) => {
  if (!item) return <></>;

  const shown = options.overview.shownAttributes;
  const labeledAttributes = item.attributes
    .filter(Boolean)
    // .flatMap((a) => getAttributesByHasRole(a, true))
    // .filter((a) => attributeInScope(shown, a))
    .filter((a) => !a?.roles?.includes("number") && !a?.roles?.includes("name"))
    .slice(0, 4);

  console.log("labeledAttributes", item.attributes, labeledAttributes);

  const unlabeledAttributes = getAttributesWithoutRoles(item) ?? [];
  // console.log('unlabeledAttributes', unlabeledAttributes);

  return (
    <div
      className="absolute w-[42px] h-[42px] flex items-center justify-center"
      // draggable={true}
      style={style}
    >
      <div className="w-full h-full flex items-center justify-center">
        <Attribute
          options={options}
          attribute={getAttributesByRole(item, "number")}
        />
      </div>
      {labeledAttributes.map((a, index) => (
        <div key={a?.id}>
          <Attribute
            className={`absolute bg-white rounded px-1 text-xs shadow-sm ${
              index === 0
                ? "top-0 left-[-20px] translate-y-[-100%] text-right" // top-left
                : index === 1
                ? "top-0 right-[-20px] translate-y-[-100%] text-left" // top-right
                : index === 2
                ? "bottom-0 left-[-20px] translate-y-[100%] text-right" // bottom-left
                : "bottom-0 right-[-20px] translate-y-[100%] text-left" // bottom-right
            }`}
            options={options}
            attribute={a}
          />
        </div>
      ))}
      {/* <div
        className={`w-full h-full rounded-full bg-white flex items-center justify-center flex flex-col items-center justify-center shadow-lg`}
      >
        <div className="relative">
        </div>
      </div> */}
      <div className="absolute left-1/2 bottom-[-22px] px-2 h-5 transform -translate-x-1/2 flex items-center justify-center bg-black/20 rounded text-white shadow-lg">
        <Attribute
          className="whitespace-nowrap text-lg"
          options={options}
          attribute={getAttributesByRole(item, "name")}
        />
      </div>
    </div>
  );
};
