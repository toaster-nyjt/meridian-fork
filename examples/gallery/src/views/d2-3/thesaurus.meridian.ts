import { BindingItemType, DataBindingType, ODI } from "@meridian-ui/meridian";

const r3WordsBinding: BindingItemType = {
  itemId: ".term",
  attributes: [
    { value: ".term", roles: ["title"] },
    { value: ".type", roles: ["subtitle"] },
    { value: ".asIn", label: "as in", roles: ["as-in"] },
    { value: ".definition", roles: ["definition"] },
    { value: ".sentence", roles: ["sentence"] },
    { id: "synonyms", value: ".synonyms", itemId: ".term", transform: [{ map: {
        attributes: [
          { value: ".term", roles: ["key-attribute"] },
          { value: ".relevance", roles: ["relevance"] },
        ]
      } }],
    },
  ]
};


const dataBinding: DataBindingType[] = [
  { id: "words", binding: r3WordsBinding },
];


export const r3ODI: ODI = {
  dataBinding: dataBinding,
  overviews: [],
  detailViews: [
    {
      id: "word",
      type: "thesaurus",
      openFrom: "all",
      // shownAttributes: 'all',
      // hiddenAttributes: [ 'key-attribute' ],
      overviews: [ {
        id: "synonyms-list",
        type: "grid",
        itemView: { type: "synonym" },
        showIn: [ "spec" ],
        // shownAttributes: [ 'key-attribute', 'relevance', 'definition' ],
        shownAttributes: [ "relevance", "key-attribute"  ],//, 'relevance', 'definition', 'title', 'subtitle', 'as-in', 'sentence' ],
        attributeBindingId: "synonyms",
        detailViews: [ "word" ],
      } ],
    }
  ]
};