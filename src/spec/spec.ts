import { CSSProperties } from "react";
import { DetailBasic } from "../components/detail-views/detail-basic";
import { OverviewBasicGridType } from "../components/overviews/overview-basic-grid";
import { OverviewBasicListType } from "../components/overviews/overview-basic-list";
import { OverviewBasicMapType } from "../components/overviews/overview-basic-map";
import { ItemProfileType } from "../components/item-views/item-profile";
import { CustomItemViewType, CustomOverviewType, CustomDetailViewType } from "../renderer/renderer.defaults";
import { ItemPinType } from "../components/item-views/item-pin";
import { FetchedItemType } from "./spec.internal";

export interface ODI {
  // In the spec, DataItemType is only a single instance. But after data binding, populated data
  // becomes a FetchedDataItemType[] --> list of the items.
  dataBinding: DataBindingType[];
  overviews: Overview[];
  detailViews?: DetailView[];
  viewLayout?: ViewLayout[];
  malleability?: Malleability;
}


// ---- DATA BINDING ATTRIBUTES ----

export interface DataBindingType {
  id?: string;
  binding: BindingItemType;
}

export interface BindingItemType {
  itemId: string; // This must be a path to some value in the item.
  pathToItems?: string; // Path to the collection of data items. Default is '.' which is itself.

  roles?: Role[];

  attributes: AttributeType[];
  internalAttributes?: AttributeType[];
}

export type AttributeValueType = "string" | "number" | "link" | "image" | "boolean" | "price" | "button" | "element" | "overview" | string;

export interface AttributeType {
  id?: string;
  itemId?: string;
  value?: string;
  label?: string;
  roles?: Role[];
  type?: AttributeValueType;

  internalAttributes?: AttributeType[];
  attributes?: AttributeType[];

  transform?: AttributeTransformType[];
  condition?: AttributeConditionType;
}

export interface AttributeTransformType {
  value?: string;
  map?: string | { itemId?: string; attributes: AttributeType[] };
  filter?: string | AttributeConditionType;
  slice?: {
    start?: number;
    end?: number;
  };
}

export interface AttributeConditionType {
  and?: AttributeConditionType[];
  or?: AttributeConditionType[];
  not?: AttributeConditionType[];

  exists?: string;
  comparison?: {
    field: string;
    operator: Operator;
    value: string | number;
  }
}

export type Operator = "==" | "!=" | ">" | "<" | ">=" | "<=";

export type Role =
  | "title" | "subtitle" | "description" | "key-attribute"
  | "action" | "link" | "tag" | "badge"
  | "thumbnail" | "caption"
  | "spec" | "footer" | string;

export type AttributeSelectionScope = (string | Role | "item")[] | "all";


// ---- OVERVIEW ----

export type Overview = OverviewBasicListType | OverviewBasicGridType | OverviewBasicMapType | CustomOverviewType;

export type OverviewType = Overview extends { type: infer T } ? T : never;

export interface OverviewConfig {
  id?: string;
  type: string;
  itemView?: ItemView;

  bindingId?: string;
  attributeBindingId?: string;
  items?: FetchedItemType[];

  // ---- PRESENTATION ----
  shownAttributes?: AttributeSelectionScope;
  hiddenAttributes?: string[];
  className?: string; // CSS for the overview component div
  style?: CSSProperties; // style for the overview component div
  itemClassName?: string; // CSS for the item div
  itemStyle?: CSSProperties; // style for the item div

  // ---- COMPOSED VIEWS ----
  overviews?: (Overview | string)[];
  detailViews?: (DetailView | string)[];
  showIn?: Role[];
}


// ---- ITEM VIEW ----

export type ItemView = ItemProfileType | ItemPinType | CustomItemViewType;

export interface ItemViewConfig {
  type: string;
}


// ---- DETAIL VIEW ----

export type DetailView = DetailBasic | CustomDetailViewType;

export interface DetailViewConfig {
  id?: string;
  type: string;
  openIn?: OpenViewIn; // Default new page
  openFrom?: AttributeSelectionScope; // Default title attributes
  openBy?: OpenViewBy; // Event to trigger to open the detail view

  bindingId?: string;
  items?: FetchedItemType[];

  // ---- PRESENTATION ----
  shownAttributes?: AttributeSelectionScope;
  hiddenAttributes?: string[];

  // ---- COMPOSED VIEWS ----
  overviews?: (Overview | string)[];
  detailViews?: (DetailView | string)[];

}

export type OpenViewBy = "click" | "hover";
export type OpenViewIn = "new-page" | "side-by-side" | "replace" | "pop-up" | "tooltip";


// ---- VIEW LAYOUT ----

// Note about view layout: By default, the view layout should work as follows:
// 1. If there's only ony view, it's taking the full screen.
// 2. If there are two, they are horizontally side by side.
// 3. After that, all views are placed into tabs.
export interface ViewLayout {
  viewId: string;
  groupIndex?: number;
  type: "panels" | "tabs" | "append";
  placement?: "top" | "bottom" | "left" | "right";
  orientation?: "horizontal" | "vertical";
}

// ---- MALLEABILITY ----

export interface Malleability {
  disabled?: boolean;
  content?: {
    disabled?: boolean | AttributeSelectionScope;
    types?: MalleableContentType[];
  },
  composition?: {
    disabled?: boolean | ("overview" | "detail")[]; // Ability to customize the number of overviews/details.
    // * Should support being able to customize whether user can make recursive ODIs
    types?: MalleableCompositionType[];
  },
  layout?: {
    disabled?: boolean | {overviewId?: string; detailId?: string}[]; // Either boolean or the overview/detail id
    types?: MalleableLayoutType[];
  }
}

export type MalleableContentType = "toggle" | string; // Future customization features can be added here: | 'always' | 'in-situ' | 'menus';
export type MalleableCompositionType = "tabs" | "toolbar" | string; // Future customization features can be added here: | 'menus' | 'toolbar';
export type MalleableLayoutType = "menus" | string; // Future customization features can be added here: | 'toolbar';

export type MalleableDimension = "content" | "composition" | "layout";