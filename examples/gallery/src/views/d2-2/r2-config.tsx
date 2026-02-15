import { OverviewSoccerField } from "./overview-soccer-field";
import { ItemPlayer } from "./item-view-player";
import { DetailPlayer } from "./detail-view-player";
import { AttributeJerseyNumber } from "./attribute-jersey-number";

export const r2Config = {
  customAttributeTypes: [
    { type: "jersey-number", view: AttributeJerseyNumber },
  ],
  customDetailViewTypes: [
    { type: "player", view: DetailPlayer, defaultSpec: {} },
  ],
  customOverviewTypes: [
    {
      type: "soccer-field",
      view: OverviewSoccerField,
      defaultSpec: {
        itemView: {
          type: "player",
        },
      },
    },
  ],
  customItemViewTypes: [{ type: "player", view: ItemPlayer }],
  onOpenDetailNewPage: (item: any) => {
    window.location.href = `/d2-2/${item?.id}`;
  },
  onOpenOverviewNewPage: () => {
    window.location.href = "/d2-2";
  },
};
