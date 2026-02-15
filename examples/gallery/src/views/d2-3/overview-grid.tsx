import { MeridianItem } from "@meridian-ui/meridian";
import { OverviewConfig } from "@meridian-ui/meridian";
import { ViewOptions } from "@meridian-ui/meridian";

export interface OverviewGridType extends OverviewConfig {
  type: "grid";
  itemView: { type: "synonym" };
}

export const OverviewGrid = (options: ViewOptions) => {
  return (
    <div className="flex flex-col justify-start gap-8">
      <div className="text-xl font-bold">Synonyms & Similar Words</div>
      <div className="flex flex-wrap gap-3 ml-4">
        {options.items.map((item, index) => (
          <div key={index} className="w-[200px]">
            <MeridianItem
              options={options}
              item={item}
              itemView={options.overview.itemView}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
