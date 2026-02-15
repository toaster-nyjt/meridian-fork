import { BindingItemType, DataBindingType, ODI } from "@meridian-ui/meridian";

export const r1binding: BindingItemType = {
  itemId: ".id",
  internalAttributes: [
    {
      id: "type",
      value: ".type",
    }
  ],
  attributes: [
    // Type-specific attributes with conditions
    {
      condition: {
        comparison: {
          field: ".type",
          operator: "==",
          value: "ad"
        }
      },
      attributes: [
        { value: ".imgsrc", type: "image", roles: ["thumbnail"] },
        { value: ".title", roles: ["title"] },
        { value: ".pretitle", roles: ["pretitle", "subtitle"] },
        { value: ".description", roles: ["description"] },
        { value: ".tag", roles: ["badge", "tag"] },
        {
          label: "Deals",
          value: ".offers",
          transform: [{ map: {
            attributes: [
              { value: ".header" },
            { value: ".text" },
            { 
              value: ".linkName", 
              type: "link",
            }
            ]
          } }],
          roles: ["footer"],
        }
      ]
    },

    // Product-specific attributes
    {
      condition: {
        comparison: {
          field: ".type",
          operator: "==",
          value: "product"
        }
      },
      attributes: [
        // Basic product information
        { value: ".title", roles: ["title"] },
        { value: ".brand", roles: ["subtitle"] },
        { value: ".description", roles: ["description"] },
        { value: ".badge", roles: ["badge"] },
        // { value: '.taglineImg', type: 'image', roles: ['main-feature', 'subtitle'] },

        { label: "Quick view", type: "link", roles: ["quick-view", "link"] },

        // Images
        { 
          value: ".colors",
          type: "image-gallery",
          roles: ["thumbnail"],
        },

        // Rating information
        {
          roles: ["rating"],
          value: ".rating", 
        },
        { 
          roles: ["reviews"],
          value: ".reviews", 
        },

        // Product features as individual items
        {
          value: ".features",
          roles: ["features", "spec"],
          transform: [{ map: "." }],
        },

        // Color options
        // {
        //   label: 'Colors',
        //   value: '.colors',
        //   transform: [{ map: { attributes: [
        //       { value: '.name' },
        //       { value: '.hex' },
        //     ]}
        //   }],
        // },

        {
          label: "Main Price",
          type: "price-monthly",
          roles: ["key-attribute"],
          value: ".capacity",
          transform: [{ map: {
            attributes: [
              { value: ".price" },
              { value: ".dealPrice" },
              { value: ".retailPrice" },
            ]
          } }],
          // attributes: [
          //   {
          //     label: 'Price',
          //     value: '.capacity[0].price',
          //   },
          //   {
          //     label: 'Retail Price',
          //     value: '.capacity[0].retailPrice',
          //   },
          //   {
          //     label: 'Deal Price',
          //     value: '.capacity[0].dealPrice',
          //   },
          // ],
        },

        // Storage capacity options
        {
          label: "Capacity",
          value: ".capacity",
          roles: ["selection"],
          transform: [{ map: {
            attributes: [
              { value: ".capacity", roles: ["capacity"] },
              { 
                label: "Price",
                value: ".price",
                type: "price",
              },
              { 
                label: "Retail Price",
                value: ".retailPrice",
                type: "price",
              }
            ]
          } }],
        },

        // Deals and offers
        {
          label: "First Offer",
          roles: ["first-offer", "footer"],
          attributes: [
            { value: ".offers[0].header", roles: ["offer-header"] },
            { value: ".offers[0].text" },
            { value: ".offers[0].linkName" }
          ]
        },
        {
          label: "Other Offers",
          value: ".offers",
          roles: ["offers", "footer"],
          transform: [{ slice: { start: 1 } }, { map: { attributes: [
              { value: ".header", roles: ["offer-header"] },
              { value: ".text" },
              { value: ".linkName" }
            ]}
          }],
        },

        // Model options
        {
          label: "Models",
          value: ".model",
          roles: ["selection"],
          transform: [{ map: { attributes: [
              { value: ".name" },
              { value: ".size" },
              { 
                label: "Price", 
                value: ".price", 
                type: "price", 
              }
            ]}
          }],
        },

        // Product link
        {
          value: "",
          label: "Choose and configure",
          type: "link",
          roles: ["choose-and-configure", "action"]
        }
      ]
    }
  ]
};

export const r1dataBinding: DataBindingType[] = [
  { binding: r1binding }
];

export const r1ODI: ODI = {
  dataBinding: r1dataBinding,
  overviews: [{
    type: "grid",
    hiddenAttributes: ["main-feature", "selection", "description", "spec", "offers", "offer-header", "choose-and-configure"],
    detailViews: [
      {
        type: "r1",
        openFrom: ["quick-view"],
        shownAttributes: ["title", "subtitle", "thumbnail", "description", "features", "capacity", "rating", "reviews", "choose-and-configure"],
      },
      {
        id: "new-page-detail",
        type: "r1",
        openFrom: ["item"],
        openIn: "new-page",
        hiddenAttributes: ["features", "capacity", "quick-view", "choose-and-configure"]
      }
    ]
  }],
};
