import { getAttributeIdsByDepth, rolesToIds } from "../helpers/attribute.helper";
import { Overview, DetailView, Malleability, AttributeSelectionScope } from "../spec/spec";
import { FetchedAttributeType, FetchedItemType, FetchedDataBindingType, FetchedODI } from "../spec/spec.internal";
import { getRecursiveAttributes } from "./renderer.data-bind";
import { defaultMalleability, overviewTypesMap } from "./renderer.defaults";
import { defaultDetailView } from "./renderer.defaults";

/**
 * Denormalizes the ODI spec. For example, if detail view is not defined,
 * it will set a default itemView. It also adds the partition/internalAttributes.
 */
export const denormalizeODI = (odi: FetchedODI): FetchedODI => {
  const denormSources = odi.dataBinding.map((source) => ({
    ...source,
    items: denormalizeFetchedItems(source.items, 0)
  }));

  if (denormSources.find(s => !s.items)) {
    console.error("Missing a fetched source in odi");
    return odi;
  }

  const denormalized: FetchedODI = {
    ...odi,
    overviews: odi.overviews.map((overview, overviewIndex) => {
      const overviewTypeDefaults = overviewTypesMap[overview.type]?.defaultSpec;
      const dataSource: FetchedDataBindingType =
        (denormSources.find(source => source.id === overview.bindingId) ?? denormSources[0]) as FetchedDataBindingType;

      if (!dataSource) {
        console.error("No data source for overview");
        return overview;
      };

      return denormalizeOverview(
        odi,
        overview,
        overviewIndex,
        overviewTypeDefaults,
        dataSource,
      );
    }),
    detailViews: odi.detailViews?.map((detailView, detailViewIndex) => {
      const dataSource: FetchedDataBindingType =
        (denormSources.find(source => source.id === detailView.bindingId) ?? denormSources[0]) as FetchedDataBindingType;
      const hasNoOverviews = odi.overviews.length === 0;

      return denormalizeDetail(
        odi,
        detailView,
        hasNoOverviews ? -10 : detailViewIndex,
        `${detailViewIndex}`,
        dataSource
      ) as DetailView;
    }),
    dataBinding: denormSources as FetchedDataBindingType[], // Preserve original structure
    malleability: denormalizeMalleability(odi.malleability),
  };

  return denormalized;
};

/**
 * Denormalizes an Overview object.
 */
export const denormalizeOverview = (
  odi: FetchedODI,
  overview: Overview,
  overviewIndex: number,
  overviewTypeDefaults: Partial<Overview>,
  dataSource: FetchedDataBindingType,
  isChange?: boolean,
): Overview => {
  const recursiveAttributes = getRecursiveAttributes(odi);
  return {
    ...overview,
    id: overview.id ?? overviewIndex.toString(),
    type: overview.type ?? "list",
    itemView: isChange
      ? null
      : overview.itemView ??
        overviewTypesMap[overview.type]?.defaultSpec?.itemView ??
        { type: "profile" },
    detailViews: makeDetails(
      odi,
      overview?.detailViews,
      overviewTypeDefaults?.detailViews,
      overviewIndex,
      dataSource
    ),
    items: dataSource.items,
    shownAttributes: rolesToIds(
      dataSource.items,
      mergeStringLists(
        overview.shownAttributes,
        !isChange ? (overviewTypeDefaults?.shownAttributes ?? getAttributeIdsByDepth(dataSource.items, 3)) : []
      )
    ),
    hiddenAttributes: rolesToIds(dataSource.items, overview.hiddenAttributes ?? []),
    // hiddenAttributes: [...rolesToIds(dataSource.items, overview.hiddenAttributes ?? []), ...recursiveAttributes.map(attr => attr.id)],
  } as Overview;
};

/**
 * Creates the details view. If no details are provided, a default detail is created.
 */
export const makeDetails = (
  odi: FetchedODI,
  details: (DetailView | string)[] | undefined,
  defaultDetails: (DetailView | string)[] | undefined,
  overviewIndex: number,
  dataSource: FetchedDataBindingType
): (DetailView | string)[] => {
  const hasNoOverviews = odi.overviews.length === 0;
  return (details ?? defaultDetails)?.map((detail, detailIndex) =>
    typeof detail === "string" ? detail :
    denormalizeDetail(
      odi,
      {
        ...defaultDetailView,
        ...detail,
      },
      hasNoOverviews ? -10 : overviewIndex,
      `${detailIndex}`,
      dataSource
    )
  ) ?? [
    denormalizeDetail(
      odi,
      {
        ...defaultDetailView,
      },
      hasNoOverviews ? -10 : overviewIndex,
      "0",
      dataSource
    ),
  ];
};

/**
 * Denormalizes a detail view.
 */
export const denormalizeDetail = (
  odi: FetchedODI,
  detail: DetailView | string,
  overviewIndex: number,
  detailId: string,
  dataSource: FetchedDataBindingType
): DetailView | string => {
  return typeof detail === "string" ? detail : {
    ...detail,
    id: detail.id ?? `${overviewIndex}-d${detailId}`,
    openIn: detail.openIn ?? (overviewIndex === -10 ? "new-page" : "pop-up"),
    detailViews: detail.detailViews
      ? detail.detailViews.map((d, dId) => denormalizeDetail(odi, d, overviewIndex, `${detailId}-d${dId}`, dataSource))
      : detail.detailViews,
    overviews: detail.overviews
      ? detail.overviews.map((o, oId) => denormalizeComposedOverview(odi, o, oId, dataSource, detailId))
      : undefined,
    items: dataSource.items,
    shownAttributes: rolesToIds(dataSource.items, detail.shownAttributes ?? "all"),
    hiddenAttributes: rolesToIds(dataSource.items, detail.hiddenAttributes ?? []),
  };
};

export const denormalizeComposedOverview = (
  odi: FetchedODI,
  composedOverview: Overview | string,
  overviewIndex: number,
  dataSource: FetchedDataBindingType,
  parentId?: string,
): Overview | string => {

  if (typeof composedOverview === "string") return composedOverview;

  //

  return {
    ...composedOverview,
    id: composedOverview.id ?? `${parentId}-${overviewIndex}`,
  };
};


/**
 * Recursively denormalizes a list of fetched items.
 * This function now uses FetchedItemType instead of the old AttributeSetType.
 */
const denormalizeFetchedItems = (
  items: FetchedItemType[] | undefined,
  overviewIndex: number,
): FetchedItemType[] | undefined => {
  if (!items) return undefined;

  return items.map((item, index) => {
    if (!item) return null as any;
    return {
      ...item,
      // Assign overviewIndex to each fetched item.
      attributes: Array.isArray(item.attributes)
        ? denormalizeFetchedAttributes(item.attributes, index)
        : [],
      internalAttributes: item.internalAttributes ?? {},
      overviewIndex,
    } as FetchedItemType;
  });
};

/**
 * Denormalizes attributes within a fetched item.
 * This function recursively handles groups/nested attributes.
 */
const denormalizeFetchedAttributes = (
  attributes: FetchedAttributeType[] | undefined,
  itemIndex: number,
  parentId?: string
): FetchedAttributeType[] => {
  if (!attributes) return [];
  return attributes.map((attr, index) => {
    // If attr is a group (object with an "attributes" property) then recursively denormalize.
    const id = attr?.id || (parentId ? `${parentId}-${index}` : `${index}`);

    // Ensure we're returning a properly typed FetchedAttributeType
    if (attr && typeof attr === "object" && "attributes" in attr && Array.isArray(attr.attributes)) {
      return {
        ...attr,
        // id,
        itemIndex,
        index: index,
        overviewIndex: -1, // Will be set later in denormalization
        path: attr?.path || "",
        attributes: denormalizeFetchedAttributes(attr.attributes, itemIndex, id),
      } as FetchedAttributeType;
    }

    // For non-group attributes
    return {
      ...attr,
      // id,
      itemIndex,
      index: index,
      overviewIndex: -1, // Will be set later in denormalization
      path: attr?.path || "",
    } as FetchedAttributeType;
  });
};

const denormalizeMalleability = (malleability: Malleability | undefined) => {
  if (!malleability) return defaultMalleability;

  return {
    ...defaultMalleability,
    ...malleability,
    content: {
      ...defaultMalleability?.content,
      ...malleability?.content,
    },
    composition: {
      ...defaultMalleability?.composition,
      ...malleability?.composition,
    },
    layout: {
      ...defaultMalleability?.layout,
      ...malleability?.layout,
    },
  };
};

const mergeStringLists = (...lists: (AttributeSelectionScope | undefined)[]): string[] => {
  return lists.filter(Boolean).flatMap(list => list) as string[];
};