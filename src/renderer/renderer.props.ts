

// ---- ITEM VIEW ----

import { ViewOptions, FetchedItemType, FetchedAttributeType } from "../spec/spec.internal";

export interface ItemViewProps {
  options: ViewOptions;
  item: FetchedItemType | undefined;
  index: number;
}



// ---- ATTRIBUTE ----

export interface AttributeProps {
  attribute: FetchedAttributeType;
  options: ViewOptions;
  item?: FetchedItemType | undefined;
}