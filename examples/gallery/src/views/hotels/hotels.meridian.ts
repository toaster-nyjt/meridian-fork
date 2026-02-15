import { ODI } from "@meridian-ui/meridian";

export const hotelsODI: ODI = {
  overviews: [
    {
      type: "map",
      hiddenAttributes: ["description", "link"]
    }
  ],
  dataBinding: [{
    id: "hotels",
    binding: {
      itemId: ".itemId",
      internalAttributes: [
        { value: ".details.latitude", label: "lat" },
        { value: ".details.longitude", label: "lng" },
      ],
      attributes: [
        { value: ".name", roles: ["title"] },
        { value: ".details.photos[0].images.original.url", roles: ["thumbnail"], type: "image" },
        { value: ".address_obj.address_string", roles: ["caption"] },
        { value: ".details.ranking_data.ranking_string", roles: ["subtitle"] },
        { value: ".details.rating", roles: ["badge"] },
        { value: ".details.price_level", roles: ["key-attribute"] },
        { value: ".details.description", roles: ["description"] },
        { value: ".details.web_url", label: "Visit Website", type: "link", roles: ["link"] },
      ],
    }
  }]
};