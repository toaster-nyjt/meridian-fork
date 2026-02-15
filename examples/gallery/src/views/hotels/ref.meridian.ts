import { ODI } from "@meridian-ui/meridian";


export const hotelsODI: ODI = {
  overviews: [
    {
      type: "grid",
      hiddenAttributes: ["description", "link"],
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
        { value: ".details.photos[0].images.original.url", type: "image", roles: ["thumbnail"] },
        { value: ".name", roles: ["title"] },
        { value: ".address_obj.address_string", roles: ["caption"] },
        // {
        //   roles: ['caption'],
        //   attributes: [
        //     { value: '.address_obj.city' },
        //     { value: '.address_obj.state' },
        //   ],
        // },
        { value: ".details.ranking_data.ranking_string", roles: ["subtitle"] },
        { value: ".details.rating", roles: ["badge"] },
        { value: ".details.price_level", roles: ["key-attribute"] },
        { value: ".details.description", roles: ["description"] },
        { value: ".details.web_url", label: "Visit Website", type: "link", roles: ["link"] },
      ],
    }
  }]
};