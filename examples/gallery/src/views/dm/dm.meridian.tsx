import { ODI } from "meridian-ui"; 
import { r2MatchBinding, r2PlayersBinding } from "../d2-2/soccer.meridian";

export const dmODI: ODI = {
  dataBinding: [
    { id: "match", binding: r2MatchBinding },
    { id: "players", binding: r2PlayersBinding },
  ],
  overviews: [
    {
      id: "players",
      type: "list",
      bindingId: "players",
      detailViews: [
        {
          type: "player",
          // openFrom: 'all',
          openFrom: ["thumbnail"],
        },
      ],
      hiddenAttributes: ["spec"],
    },
  ],
  malleability: {
    composition: { disabled: true },
  },
};
