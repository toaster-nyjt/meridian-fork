import { roleTypesMap } from "../renderer/renderer.defaults";
import { AttributeSelectionScope, Role } from "../spec/spec";
import { FetchedAttributeGroupType, FetchedAttributeType, FetchedItemType } from "../spec/spec.internal";
import { isAttributeType } from "./spec.helper";


export const removeDuplicates = (strings: string[]): string[] => {
  return strings.reduce((acc, current) => {
    if (!acc.includes(current)) {
      acc.push(current);
    }
    return acc;
  }, [] as string[]);
};

/**
 * Turns the list of Ids and Roles to just Ids. If there is a Role, find all attributes in that role and
 * put all of their Ids in the return list.
 * If role is in an AttributeSet, then get all the attributes Ids in the subtree.
 * @param idsAndRoles 
 * @returns 
 */
export const rolesToIds = (
  items: FetchedItemType[] | undefined,
  idsAndRoles: AttributeSelectionScope
): string[] => {
  // Recursive function to collect attribute IDs from a set of attributes.
  const collectIds = (
    attributeSet: FetchedAttributeType[],
    role: string,
    regardless: boolean = false
  ): string[] => {
    return attributeSet.flatMap((attr) => {
      if (!attr) return [];

      // Determine if this attribute is a group by checking for nested attributes.
      const isGroup = (attr as FetchedAttributeGroupType).attributes !== undefined;

      // Check if this attribute "matches" the requested role.
      // If no role is specified or if 'regardless' is true then we consider it a match.
      let matches = !role || regardless;
      if (!matches && attr.roles && Array.isArray(attr.roles)) {
        matches = attr.roles.includes(role);
      }

      if (!isGroup) {
        // A leaf attribute: if it matches, return its ID.
        return matches ? [attr.id] : [];
      } else {
        // For a group attribute, check if the group itself matches.
        const group = attr as FetchedAttributeGroupType;
        let groupMatches = matches;
        if (!groupMatches && group.roles && Array.isArray(group.roles)) {
          groupMatches = group.roles.includes(role);
        }
        // Recursively collect child IDs, passing down a flag if the group matches.
        const childIds = collectIds(group.attributes, role, regardless || groupMatches);
        // Optionally include the group ID if it matches.
        return (matches ? [group.id] : []).concat(childIds);
      }
    });
  };

  // If "all" is specified (or included) then collect all IDs regardless of role.
  if (idsAndRoles === "all" || (Array.isArray(idsAndRoles) && idsAndRoles.includes("all"))) {
    if (!items) return [];
    return removeDuplicates(items.flatMap(item => collectIds(item.attributes, "", true)));
  }

  // Otherwise, process each element in idsAndRoles.
  if (Array.isArray(idsAndRoles)) {
    const roles = items ? getRoles(items) : [];
    
    return removeDuplicates(idsAndRoles.flatMap((entry) => {
      // If the entry is a string and not the literal string "item", treat it as a role
      if (typeof entry === "string" && entry !== "item" && roles.includes(entry)) {
        // No need to check isRole since any string can be a role now
        return items ? items.flatMap(item => collectIds(item.attributes, entry)) : [];
      } else if (entry === "item") {
        // If "item" is specified, return the IDs of the binding items themselves.
        return items ? items.map(item => item.itemId) : [];
      } else {
        // Otherwise, assume it's an attribute ID literal.
        return [entry];
      }
    }));
  }
  return [];
};

/**
 * Converts a list of attribute IDs to their corresponding roles.
 * This is the inverse operation of rolesToIds.
 * @param items The fetched items containing attributes
 * @param ids Array of attribute IDs to convert to roles
 * @returns Array of unique roles associated with the given attribute IDs
 */
export const idsToRoles = (
  items: FetchedItemType[] | undefined,
  ids: string[] | "all"
): string[] | "all" => {
  if (ids === "all") return "all";
  if (!items || !ids.length) return [];

  const rolesMap = new Map<string, string[]>();

  // Recursive function to build a mapping of attribute IDs to their roles
  const mapIdsToRoles = (attributes: FetchedAttributeType[]): void => {
    attributes.forEach(attr => {
      if (!attr) return;

      // Store roles for this attribute ID
      if (attr.id && attr.roles && Array.isArray(attr.roles)) {
        rolesMap.set(attr.id, attr.roles);
      }

      // Process nested attributes if this is a group
      if ("attributes" in attr && Array.isArray(attr.attributes)) {
        mapIdsToRoles(attr.attributes);
      }
    });
  };

  // Build the mapping for all items
  items.forEach(item => {
    if (item?.attributes) {
      mapIdsToRoles(item.attributes);
    }
  });

  // Collect all roles for the requested IDs
  const roles = ids.flatMap(id => rolesMap.get(id) || []);
  
  // Remove duplicates and return
  return removeDuplicates(roles);
};

export const getRoles = (items: FetchedItemType[]): string[] => {
  const collectRoles = (attributes: FetchedAttributeType[]): string[] => {
    return attributes.flatMap(attribute => {
      // Get roles from current attribute
      const currentRoles = attribute?.roles || [];
      
      // Check if it's a group attribute with nested attributes
      if (attribute && "attributes" in attribute && Array.isArray(attribute.attributes)) {
        // Recursively collect roles from nested attributes
        return [...currentRoles, ...collectRoles(attribute.attributes)];
      }
      
      return currentRoles;
    });
  };
  
  // Process all items and their attributes
  const allRoles = items.flatMap(item => 
    item?.attributes ? collectRoles(item.attributes) : []
  ).filter(role => role !== undefined) as string[];
  
  // Remove duplicates using the existing removeDuplicates helper
  return removeDuplicates(allRoles);
};

// Given a list of AttributeSets, return a list of all the Ids in the AttributeSets at a certain depth
// Note: It only returns the Ids of attributes, not attributeSets
export const getAttributeIdsByDepth = (items: FetchedItemType[], depth: number): string[] => {
  if (depth === 0) return [];

  const attributesByDepth = (attributes: FetchedAttributeType[], depth: number): string[] => {
    return attributes.flatMap(attribute => {
      if (isAttributeType(attribute)) {
        // It's an attribute
        return attribute?.id ? [attribute.id] : [];
      } else {
        return attribute ? attributesByDepth(attribute.attributes, depth-1) : [];
      }
    });
  };
  return items.flatMap(i => attributesByDepth(i.attributes, depth));
};

export const getAttributesByRole = (
  item: FetchedItemType,
  role: Role
): FetchedAttributeType[] | undefined => {
  if (!item || !item.attributes) return undefined;

  const findAttributesByRole = (attribute: FetchedAttributeType): FetchedAttributeType[] => {
    const results: FetchedAttributeType[] = [];
    
    // Check if current attribute has the role
    if (attribute?.roles?.includes(role)) {
      results.push(attribute);
    }
    
    // Check nested attributes if they exist
    if (attribute && "attributes" in attribute && Array.isArray(attribute.attributes)) {
      attribute.attributes.forEach(attr => {
        const nestedResults = findAttributesByRole(attr);
        if (nestedResults.length > 0) {
          results.push(...nestedResults);
        }
      });
    }
    
    return results;
  };

  // Process all top-level attributes
  const results: FetchedAttributeType[] = [];
  item.attributes.forEach(attr => {
    results.push(...findAttributesByRole(attr));
  });
  
  return results.length > 0 ? results : undefined;
};

/**
 * * Flattens the list of attributes
 * Get all of the attributes that don't have a role, and return them as one list.
 * If an AttributeGroup does not have a role, but its child does, return the AttributeGroup without that child.
 * So once you find a role, you don't add it. If you don't find a role, return that attribute but without the attributes with roles
 */
export const getAttributesByHasRole = (attribute: FetchedAttributeType, hasRole: boolean): FetchedAttributeType[] => {
  // If hasRole is true, return attributes that have a role
  if (hasRole) {
    return attribute?.roles?.length ? [attribute] : [];
  }

  // If hasRole is false, return attributes that do not have a role
  if (!attribute?.roles?.length) {
    return isAttributeType(attribute) ? [attribute] : attribute?.attributes.flatMap(attribute => getAttributesByHasRole(attribute, hasRole)) ?? [];
  }

  return [];
};

/**
 * Given the selection scope, if the id or role of attributeToFind exists in the selection scope, return true.
 * If the selection scope is all, then return true.
 * @param attributeSelectionScope 
 * @param attributeToFind 
 * @returns 
 */
export const attributeInScope = (
  attributeSelectionScope: AttributeSelectionScope | undefined,
  attributeToFind: FetchedAttributeType
): boolean => {
  if (!attributeSelectionScope || !attributeToFind) return false;
  if (attributeSelectionScope === "all") return true;

  return attributeSelectionScope.some((selectionScope) => {
    return attributeToFind.roles?.includes(selectionScope) || selectionScope === attributeToFind.id;
  });
};


export const filterAttributeFromScope = (selectedAttributes: string[], attribute: FetchedAttributeType): string[] => {
  // If there's a whole partition, ... oof not sure what to do there.. cause we don't know how far the number of attributes exist...
  // Maybe there shouldn't be any whole partitions when it comes to selection....... I'll just not do it for now..

  // If you find a partition as aspect, then remove the partition Index.
  // If you find the id, then remove the id.

  return selectedAttributes.filter(attributeId => attributeId !== attribute?.id);
};


export const addAttributeToScope = (selectedAttributes: string[], attribute: FetchedAttributeType): string[] => {
  // If there's a whole partition, ... oof not sure what to do there.. cause we don't know how far the number of attributes exist...
  // Maybe there shouldn't be any whole partitions when it comes to selection....... I'll just not do it for now..

  // If you find a partition as aspect, then remove the partition Index.
  // If you find the id, then remove the id.

  return attribute?.id ? selectedAttributes.concat(attribute.id) : selectedAttributes;
};

// Given something, return the number of data attributes added to that partition
export const getPartitionSize = () => {};

export const getAttributesWithoutRoles = (
  item: FetchedItemType,
  excludeDefaultRoles: boolean = false
): FetchedAttributeType[] | undefined => {
  if (!item || !item.attributes) return undefined;

  // Import the default roles from roleTypesMap if we need to exclude them
  const defaultRoles = excludeDefaultRoles ? Object.values(roleTypesMap) : [];

  const findAttributesWithoutRoles = (
    attribute: FetchedAttributeType,
    parentHasRole: boolean = false
  ): FetchedAttributeType[] => {
    const results: FetchedAttributeType[] = [];
    
    // Check if current attribute has any roles
    const hasRoles = attribute?.roles && attribute?.roles?.length !== 0;
    
    // Check if current attribute has any default roles (if we're excluding them)
    const hasDefaultRole = excludeDefaultRoles && 
      attribute?.roles?.some(role => defaultRoles.includes(role as Role));
    
    // Include attribute if:
    // 1. Parent doesn't have a role AND
    // 2. Either we're not excluding default roles and it has no roles,
    //    OR we are excluding default roles and it doesn't have any default roles
    if (!parentHasRole && ((!excludeDefaultRoles && !hasRoles) || (excludeDefaultRoles && !hasDefaultRole))) {
      results.push(attribute);
    }
    
    // Check nested attributes if they exist
    if (attribute && "attributes" in attribute && Array.isArray(attribute.attributes)) {
      attribute.attributes.forEach(attr => {
        // Pass down whether this parent has a role
        const nestedResults = findAttributesWithoutRoles(attr, hasRoles);
        if (nestedResults.length > 0) {
          results.push(...nestedResults);
        }
      });
    }
    
    return results;
  };

  // Process all top-level attributes
  const results: FetchedAttributeType[] = [];
  item.attributes.forEach(attr => {
    results.push(...findAttributesWithoutRoles(attr));
  });
  
  return results.length > 0 ? results : undefined;
};


