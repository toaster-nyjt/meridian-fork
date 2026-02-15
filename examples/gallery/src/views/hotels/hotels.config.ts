import { OverviewMap } from "./map-overview";
import { DetailView } from "@meridian-ui/meridian";


export const hotelsConfig = {
  customDetailViewTypes: [],
    customOverviewTypes: [
      {
        type: "map",
        view: OverviewMap,
        defaultSpec: {
          shownAttributes: ["key-attribute"],
          itemView: {
            type: "pin",
          },
          detailViews: [
            {
              type: "basic",
              openFrom: "all",
            },
          ] as DetailView[],
        },
      }
    ],
    customItemViewTypes: [],
    onOpenDetailNewPage: (item: any) => {
      window.location.href = `/hotels/${item?.itemId}`;
    },
    onOpenOverviewNewPage: () => {
      window.location.href = "/hotels";
    },
  };