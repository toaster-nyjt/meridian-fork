import { MeridianItem } from "../../renderer/renderer";
import { OverviewConfig } from "../../spec/spec";
import { ViewOptions } from "../../spec/spec.internal";
import "./overview-basic.scss";
export interface OverviewBasicGridType extends OverviewConfig {
  type: "grid";
  itemView: { type: "vertical" };
}

export const OverviewBasicGrid = (options: ViewOptions) => {
  return (
    <div className="overview-basic-grid">
      <div className="overview-basic-container">
        {options.items.map((item, index) => (
          <div key={index} className="overview-basic-item">
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
