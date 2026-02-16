import { AttributeJerseyNumber } from "../d2-2/attribute-jersey-number";
import { ItemPlayer } from "../d2-2/item-view-player";
import { OverviewSoccerField } from "../d2-2/overview-soccer-field";
import { DMItemProfile } from "./item-profile";
import { DMItemVertical } from "./item-vertical";

export const dmConfig = {
  customAttributeTypes: [
    { type: "jersey-number", view: AttributeJerseyNumber },
  ],
  customDetailViewTypes: [],
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
  customItemViewTypes: [
    { type: "player", view: ItemPlayer },
    { type: "profile", view: DMItemProfile, defaultSpec: {} },
    { type: "vertical", view: DMItemVertical, defaultSpec: {} },
  ],
  onOpenDetailNewPage: (item: any) => {
    window.location.href = `/d2-3/${item?.id}`;
  },
  onOpenOverviewNewPage: () => {
    //   window.location.href = `/r3`;
  },
};
