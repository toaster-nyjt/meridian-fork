import { DetailView, ODI, Overview } from "../spec/spec";
import { XYPosition, XYSize } from "./utils.helper";
import skeletonData from "../assets/dummy-data/skeleton.json";
import { FetchedAttributeGroupType, FetchedAttributeType, FetchedDataBindingType, FetchedODI, ViewOptions } from "../spec/spec.internal";
import { attributeInScope } from "./attribute.helper";

// ! Does not yet support recursive
export const findOverview = (odi: ODI | undefined, id: string): Overview | undefined => {
  if (!odi) return undefined;
  return odi.overviews.find(o => o.id === id);
};

export const findOverviewFromItsDetail = (odi: ODI | undefined, detailId: string): Overview | undefined => {
  if (!odi) return undefined;
  const standard = odi.overviews.find(o => o.detailViews?.find(d => (typeof d === "string" ? d : d.id) === detailId));
  if (standard) return standard;

  // If not found, search in detailViews.overviews
  if (odi?.detailViews) {
    const detailView = odi.detailViews.find(detailView => {
      if (!detailView.overviews) return false;
      
      return detailView.overviews.some(overview => {
        if (typeof overview === "string") return false;
        return overview.detailViews?.some(d => 
          (typeof d === "string" ? d : d.id) === detailId
        );
      });
    });
    
    if (detailView?.overviews) {
      const overview = detailView.overviews.find(o => {
        if (typeof o === "string") return false;
        return o.detailViews?.some(d => 
          (typeof d === "string" ? d : d.id) === detailId
        );
      });
      
      if (overview && typeof overview !== "string") return overview;
    }
  }
};

// ! Does not yet support recursive
export const findDetail = (odi: ODI | undefined, id: string): DetailView | undefined => {
  if (!odi) return undefined;
  let detail: DetailView | undefined;
  odi.overviews.forEach(o => {
    const d = o.detailViews?.find(d => (typeof d === "string" ? d : d.id) === id);
    if (d) {
      detail = typeof d === "string" ? odi.detailViews?.find(dv => dv.id === d) : d;
    }
  });
  return detail;
};

// export const confirmGroup = (attributeSet: AttributeSetType): AttributeGroupType | null => {
//   if (attributeSet && !('value' in attributeSet)) return attributeSet;
//   return null
// }

// Given the mouse position (which is the top left corner of the view) and view size,
// return the shifted position, where the position is now the bottom middle of the view.
export const getBottomCenter = (
  mousePosition: XYPosition,
  viewSize: XYSize
): { left: number; top: number } => {
  // To get the bottom-center position:
  // x: shift right by half the width
  // y: shift down by the full height
  return {
    left: mousePosition.x - viewSize.width / 2,
    top: mousePosition.y - viewSize.height
  };
};


export const checkDataLists = (data: any | undefined) => {
  return (!data ||
  Array.isArray(data) && data.length === 0 ||
  Array.isArray(data) && data.every((dataset: any) => !dataset || dataset.length === 0)
    ? [skeletonData]
    : data);};


export const getDataBindingById = (odi: FetchedODI | undefined, id: string | undefined): FetchedDataBindingType  => {
  return odi?.dataBinding.find(binding => binding.id === id) || odi!.dataBinding[0];
};

export const getAttributeDataBindingById = (odi: FetchedODI | undefined, bindingId: string | undefined, attribute: FetchedAttributeType): FetchedAttributeGroupType | undefined  => {
  const items = odi?.dataBinding.find(binding => binding.id === bindingId)?.items ?? odi!.dataBinding[0].items;

  const attributes = items
    ?.at(attribute?.itemIndex ?? 0)?.attributes;
  
  const group = attributes
    ?.find(attr => attr?.id === attribute?.id) as FetchedAttributeGroupType
     || items[0];

  return group;
};

export const getOverviewById = (odi: ODI | undefined, id: string): Overview | undefined => {
  return odi?.overviews.find(o => o.id === id);
};

export const findOverviewById = (odi: ODI | undefined, id: string): Overview | undefined => {
  // First try to find in top-level overviews
  const topLevelOverview = odi?.overviews.find(o => o.id === id);
  if (topLevelOverview) return topLevelOverview;

  // If not found, search in detailViews.overviews
  if (odi?.detailViews) {
    for (const detailView of odi.detailViews) {
      if (detailView.overviews) {
        for (const overview of detailView.overviews) {
          // Skip string references
          if (typeof overview === "string") continue;

          if (overview.id === id) {
            return overview;
          }
        }
      }
    }
  }
  
  return undefined;
};


export const getDetailViewById = (view: DetailView | string, odi: ODI | undefined): DetailView | undefined => {
  if (typeof view === "string") {
    // If view is a string ID, try to find it in odi.detailViews first
    if (odi?.detailViews) {
      const detailView = odi.detailViews.find(d => d.id === view);
      if (detailView) return detailView;
    }
    return undefined;
  }
  return view;
};

export const findDetailViewById = (odi: ODI | undefined, id: string): DetailView | undefined => {
  return odi?.detailViews?.find(d => d.id === id);
};

// Find the detail view that should open from clicking this attribute
export const findDetailViewToOpen = (options: ViewOptions, odi: FetchedODI | undefined, attribute: FetchedAttributeType) => {
  // console.log('options', options?.overview?.detailViews);
  const detailView = 
  // options.viewType === 'overview' ? undefined :
    [...(options?.overview?.detailViews ?? []), ...(odi?.detailViews ?? [])].find(
      (detail) =>
        (typeof detail === "string" ? false : (attributeInScope(detail.openFrom, attribute)) ||
          detail.openFrom === "all") &&
        options.items[attribute?.itemIndex ?? 0]
    );
  // console.log('detailView', options.viewType);
  if (typeof detailView === "string") {
    return odi?.detailViews?.find(d => d.id === detailView);
  }
  return detailView;
};

// Function to find the detail view that should open from clicking an item
export const findItemDetailViewToOpen = (options: ViewOptions, odi: FetchedODI | undefined) => {
  // Find the detail view reference that should open from clicking this item
  const detailToOpenRef = [...(options?.overview?.detailViews ?? []), ...(odi?.detailViews ?? [])]?.find((detail) => {
    if (typeof detail === "string") {
      const detailView = odi?.detailViews?.find(d => d.id === detail);
      return detailView?.openFrom === "all" || detailView?.openFrom?.includes("item");
    } else {
      return detail.openFrom === "all" || detail.openFrom?.includes("item");
    }
  });

  // Ensure we have the actual detail view object, not just the string reference
  const detailToOpen = typeof detailToOpenRef === "string" 
    ? odi?.detailViews?.find(d => d.id === detailToOpenRef)
    : detailToOpenRef;

  return detailToOpen;
};
