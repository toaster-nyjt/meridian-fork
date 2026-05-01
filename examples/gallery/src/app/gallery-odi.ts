import { ODI } from "meridian-ui";

export const galleryODI: ODI = {
  dataBinding: [{
    binding: {
      itemId: ".id",
      attributes: [
        { value: ".title", roles: ["title"] },
        { label: "Link to original page", value: ".originalURL", type: "link", roles: ["link"] },
        { value: ".defaultSpec", roles: ["spec"] },
      ]
    }
  }],
  overviews: [
    {
      type: "grid",
    }
  ],
};
