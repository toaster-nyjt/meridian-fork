import { isAttributeType } from "../helpers/spec.helper";
import { AttributeSelectionScope, DetailView, ODI } from "../spec/spec";
import { FetchedAttributeType, FetchedItemType } from "../spec/spec.internal";
import { defaultDetailView, defaultOverview } from "./renderer.defaults";

/**
 * Filters a hierarchical AttributeSet based on shown and hidden attribute IDs
 * * This is a wrapper function.
 * @param items The AttributeSet items to filter
 * @param shownAttributes List of attribute IDs to show, or 'all' to show everything
 * @param hiddenAttributes List of attribute IDs to always hide
 * @returns Filtered AttributeSet items
 */
export const filterItemAttributes = (
  items: FetchedItemType[],
  shownAttributes: AttributeSelectionScope | undefined,
  hiddenAttributes: AttributeSelectionScope | undefined,
  viewId: string,
): FetchedItemType[] => {

  // If no items, return empty array
  if (!items || items.length === 0) return [];

  // Default values if undefined
  const shown = shownAttributes || "all";
  const hidden = hiddenAttributes || [];

  const final = items
    .map(item => ({
      ...item,
      attributes: item.attributes.map(attribute => filterAttributesAndAttributeSets(attribute, shown, hidden, viewId))
    }));

  // console.log('final', final);

  return final;
};

/**
 * Recursively filters a single AttributeSet or Attribute based on shown and hidden IDs
 * @param attribute The AttributeSet or Attribute to filter
 * @param shownAttributes List of attribute IDs to show, or 'all' to show everything
 * @param hiddenAttributes List of attribute IDs to always hide
 * @returns Filtered AttributeSet, or null if it should be removed
 */
const filterAttributesAndAttributeSets = (
  attribute: FetchedAttributeType,
  shownAttributes: AttributeSelectionScope,
  hiddenAttributes: AttributeSelectionScope,
  viewId: string,
): FetchedAttributeType | null => {


  // Skip if it doesn't have an ID
  if (!attribute?.id) return null;

  // // Skip if the attributeId is the viewId
  // if (attribute.id === viewId) {
  //   // console.log('skipping', attribute, viewId)
  //   return null
  // };

  // Skip if it's in the hidden list (applies to both Attributes and AttributeSets)
  if (Array.isArray(hiddenAttributes) && hiddenAttributes.includes(attribute.id)) {
    return null;
  }

  // * I'm just blindly returning once it's in found.
  // * Instead, I need to make sure it's in shown, but still search.
  // * Through my search, if I find child is hidden, then hide that.

  const toShow = shownAttributes === "all" || shownAttributes.includes(attribute.id);

  // console.log('here?')
  // For Attributes (has 'value' property)
  if (isAttributeType(attribute)) {
    return toShow ? attribute : null;
  }



  // For AttributeSets (has 'attributes' property)
  else {
    // Recursively filter its children
    const filteredAttributes = attribute.attributes
      .map(attr => filterAttributesAndAttributeSets(attr, shownAttributes, hiddenAttributes, viewId));

    // console.log('??', filteredAttributes)
    // Skip if there are no children left after filtering
    if (filteredAttributes.length === 0) return null;


    // Return the AttributeSet with filtered children
    return {
      ...attribute,
      attributes: filteredAttributes
    };
  }
};

export const mapRecursiveAttributes = (
  attributeItems: FetchedItemType[],
  originalItems: FetchedItemType[],
  viewId: string,
): FetchedItemType[] => {
  const mappedAttributeItems = attributeItems.map(attribute => {
    const originalItem = originalItems.find(item => item.itemId === attribute.itemId);
    return {
      ...attribute,
      attributes: [
        ...attribute.attributes,
        ...(originalItem?.attributes?.filter(attr => attr?.id !== viewId) ?? [])
      ]
    };
  });
  return mappedAttributeItems;
};


/**
* Overrides properties of a base AttributeSet array with properties from an override AttributeSet array
* @param baseItem The base AttributeSet array
* @param overrideItem The AttributeSet array with property overrides
* @returns AttributeSet array with overridden properties
*/
// export const overrideItemProperties = (
//  baseItem: FetchedItemType[] | undefined,
//  overrideItem: FetchedItemType[] | undefined
// ): FetchedItemType[] => {
//   // Handle edge cases
//   if (!baseItem || baseItem.length === 0) return overrideItem ?? [];
//   if (!overrideItem || overrideItem.length === 0) return baseItem;

//   const overrideAttributeProperties = (
//     baseAttributes: FetchedAttributeType[],
//     overrideAttributes: FetchedAttributeType[]
//   ) => {
//     // If override set is provided, use its length and structure as the primary guide
//     return overrideAttributes.map((oAttribute, index) => {
//       // Get corresponding base item if it exists
//       const bAttribute = index < baseAttributes.length ? baseAttributes[index] : undefined;

//       // If no base item or no override item, return the one that exists
//       if (!bAttribute) return oAttribute;
//       if (!oAttribute) return bAttribute;

//       // Handle Attribute (has 'value' property)
//       if (isAttributeType(oAttribute) && isAttributeType(bAttribute)) {
//         return {
//           ...bAttribute,
//           ...Object.fromEntries(
//             Object.entries(oAttribute).filter(([_, value]) => 
//               value !== undefined && (typeof value !== 'string' || value.length > 0)
//             )
//           ),
//           // Always keep these properties from the override
//           id: oAttribute.id || bAttribute.id,
//         };
//       }

//       // Handle AttributeSet (has 'attributes' property)
//       if (!isAttributeType(oAttribute) && !isAttributeType(bAttribute)) {
//         return {
//           ...bAttribute,
//           // Merge properties from override, filtering out undefined/empty values
//           ...Object.fromEntries(
//             Object.entries(oAttribute)
//               .filter(([key, value]) => 
//                 key !== 'attributes' && value !== undefined && 
//                 (typeof value !== 'string' || value.length > 0)
//               )
//           ),
//           // Always keep these properties from the override
//           id: oAttribute.id || bAttribute.id,
//           index: oAttribute.index ?? bAttribute.index,
//           overviewIndex: oAttribute.overviewIndex ?? bAttribute.overviewIndex,
//           // Recursively merge child attributes
//           attributes: overrideAttributeProperties(
//             bAttribute.attributes,
//             oAttribute.attributes
//           )
//         };
//       }

//       // If types don't match (one is Attribute, one is AttributeSet), prefer the override
//       return oAttribute;
//     });
//   }

//   return overrideItem.map(o => ({
//     ...overrideItem,
//   }))

// };

export const getFirstDetail = (odi: ODI): DetailView => {
  const firstDetailView = odi.overviews.find(overview => (overview.detailViews?.length??0) > 0)?.detailViews?.at(0);
  
  if (typeof firstDetailView === "string") {
    // If it's a string ID, find the actual detail view in odi.detailViews
    return odi.detailViews?.find(detail => detail.id === firstDetailView) ?? defaultDetailView;
  }
  
  return firstDetailView ?? defaultDetailView;
};

export const getFirstOverview = (odi: ODI) => {
  return odi.overviews.find(overview => overview) ?? defaultOverview;
};
