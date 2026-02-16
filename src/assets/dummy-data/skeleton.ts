import { BindingItemType, DataBindingType, ODI } from "../../spec/spec";

// const 

// const skeletonBinding: BindingItemType = {
//   id: '.id',
  
// }

const binding: BindingItemType = {
  itemId: ".id",
  attributes: [
    { value: ".name", roles: ["thumbnail"] },
    { value: ".name", roles: ["title"] },
    { value: ".name", roles: ["subtitle"] },
    { value: ".name", roles: ["description"] },
  ]
};

const dataSources: DataBindingType[] = [
  { binding: binding }
];

export const skeletonODI: ODI = {
  dataBinding: dataSources,
  overviews: [{ type: "list", itemView: { type: "profile-skeleton"} }],
};