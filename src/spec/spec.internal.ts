import { ReactElement } from "react";
import { ViewType } from "../helpers/spec.helper";
import { Role, Overview, Malleability, BindingItemType, DetailView, AttributeValueType } from "./spec";

// -- THESE TYPES ARE ONLY USED FOR THE MERIDIAN UI PACKAGE --


// ---- FETCHED ATTRIBUTES ----

export interface FetchedODI {
  dataBinding: FetchedDataBindingType[];
  overviews: Overview[];
  detailViews?: DetailView[];
  malleability?: Malleability;
}

export interface FetchedDataBindingType {
  id?: string;
  binding: BindingItemType;
  items: FetchedItemType[];
}

export interface FetchedItemType {
  itemId: string;
  pathToItems?: string; // Path to the collection of data items. Default is '.' which is itself.

  roles?: Role[];
  index: number;
  overviewIndex?: number;

  attributes: FetchedAttributeType[];
  internalAttributes: FetchedAttributeType[];
}

export interface FetchedAttributeValueType {
  id: string; // This id is for detail views to reference this attribute specifically
  index: number;
  itemIndex: number; // The order this attribute was placed in the partition array
  overviewIndex: number;
  path: string; // This is the previous value of the attribute.value
  label?: string;
  roles?: Role[];
  type?: AttributeValueType;
  itemId?: string;

  value?: string | ReactElement | any;
}

export interface FetchedAttributeGroupType {
  id: string; // If not explicitly named, the denormalizer functions will explicitly assign it an id.
  index: number;
  overviewIndex: number;
  itemIndex: number;
  path: string; // This is the previous value of the attribute.value
  label?: string;
  roles?: Role[];
  type?: AttributeValueType;
  itemId?: string;

  attributes: FetchedAttributeType[];
}

export type FetchedAttributeType = FetchedAttributeValueType | FetchedAttributeGroupType | null;

export interface ViewOptions {
  overview: Overview;
  items: FetchedItemType[];
  viewType: ViewType;
  onOpenDetailNewPage: (item: FetchedItemType) => void;
  onOpenOverviewNewPage: () => void;
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
}


// ---- VIEWS ----

