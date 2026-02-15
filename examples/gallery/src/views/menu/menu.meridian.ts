import { ODI } from "@meridian-ui/meridian";

export const menuODI: ODI = {
  overviews: [
    {
      id: "menu",
      type: "grid",
      hiddenAttributes: ["footer"],
    }
  ],
  dataBinding: [
    {
      id: "menu",
      binding: {
        itemId: ".id",
        attributes: [
          { value: ".id", roles: ["id"] },
          { value: ".thumbnail", roles: ["thumbnail"], type: "image" },
          { value: ".title", roles: ["title"] },
          // { value: '.price', roles: ['tag'] },
          { value: ".description", roles: ["description"] },
          { value: ".bestSellerLabel", roles: ["badge"], type: "image", condition: { exists: ".bestSellerLabel" } },
          // { value: '.details.ingredients', roles: ['spec'], label: 'Ingredients' },
          { value: ".details.nutrition", roles: ["footer"], label: "Nutrition" },
        ]
      }
    }
  ]
};
