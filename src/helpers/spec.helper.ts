import { BindingItemType, DataBindingType, DetailView, ODI, Overview, Role } from "../spec/spec";
import { FetchedAttributeType, FetchedAttributeValueType, FetchedODI } from "../spec/spec.internal";

export type ViewType = "overview" | "detail"; // item is not a type for View type, despite it also being a core component.


export const isAttributeType = (attribute: FetchedAttributeType): attribute is FetchedAttributeValueType => {
  return !!attribute && "value" in (attribute as FetchedAttributeValueType);
};

const ROLE_SET = new Set<Role>([
  "title", "subtitle", "description", "key-attribute",
  "action", "link", "tag", "badge",
  "thumbnail", "caption",
  "spec", "footer"
]);

export const isRole = (str: string): str is Role => {
  return ROLE_SET.has(str as Role);
};

/**
 * Converts a FetchedODI (with data) to a regular ODI specification (without data)
 * @param fetchedODI The FetchedODI object with fetched data
 * @returns A clean ODI specification without the fetched data
 */
export const convertFetchedODIToODI = (fetchedODI: FetchedODI): ODI => {
  if (!fetchedODI) return {} as ODI;

  // Convert FetchedDataBindingType[] to DataBindingType[]
  const dataBinding: DataBindingType[] = fetchedODI.dataBinding.map(source => {
    // Extract the binding configuration without the fetched items
    const binding: BindingItemType = {
      itemId: source.binding.itemId,
      attributes: source.binding.attributes,
      internalAttributes: source.binding.internalAttributes,
      pathToItems: source.binding.pathToItems
    };

    return {
      id: source.id,
      binding
    };
  });

  // Create the clean ODI object
  const cleanODI: ODI = {
    dataBinding,
    overviews: fetchedODI.overviews.map(overview => {
      // Create a clean overview without items
      const cleanOverview: Overview = {
        ...overview,
        items: undefined // Remove the items property
      };
      return cleanOverview;
    }),
    detailViews: fetchedODI.detailViews?.map(detailView => {
      if (typeof detailView === "string") {
        return detailView;
      }
      
      // Create a clean detail view without items
      const cleanDetailView: DetailView = {
        ...detailView,
        items: undefined // Remove the items property
      };
      
      // Handle nested overviews in detail views if they exist
      if (detailView.overviews) {
        cleanDetailView.overviews = detailView.overviews.map(nestedOverview => {
          if (typeof nestedOverview === "string") {
            return nestedOverview;
          }
          return {
            ...nestedOverview,
            items: undefined // Remove the items property
          };
        });
      }
      
      return cleanDetailView;
    }),
    malleability: fetchedODI.malleability
  };

  return cleanODI;
};
