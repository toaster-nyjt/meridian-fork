import { create } from "zustand";

interface StyleState {
  // Design Space
  designSpaceProperty: string;
  setDesignSpaceProperty: (prop: string) => void;

  // Selected object type and ID
  selectedType: "attribute" | "itemView" | "detailView" | "overview" | null;
  selectedId: string | null;

  // Selection actions
  setSelectedObject: (type: "attribute" | "itemView" | "detailView" | "overview", id: string) => void;
  clearSelection: () => void;

  // Styles for attributes, views and overviews
  attributeStyles: Record<string, any>;
  itemViewStyles: Record<string, any>;
  detailViewStyles: Record<string, any>; 
  overviewStyles: Record<string, any>;

  // Actions
  setAttributeStyle: (attributeId: string, style: any) => void;
  setItemViewStyle: (viewId: string, style: any) => void;
  setDetailViewStyle: (viewId: string, style: any) => void;
  setOverviewStyle: (overviewId: string, style: any) => void;
}

export const useStyleStore = create<StyleState>((set) => ({
  designSpaceProperty: "",
  setDesignSpaceProperty: (prop: string) => set({designSpaceProperty: prop}),
  
  selectedType: null,
  selectedAttribute: null,
  selectedId: null,

  setSelectedObject: (type: "attribute" | "itemView" | "detailView" | "overview", id: string) =>
    set(() => ({
      selectedType: type,
      selectedId: id,
    })),

  clearSelection: () => set(() => ({
    selectedType: null,
    selectedId: null,
  })),

  attributeStyles: {},
  itemViewStyles: {},
  detailViewStyles: {},
  overviewStyles: {},

  setAttributeStyle: (attributeId: string, style: any) =>
    set((state) => ({
      attributeStyles: {
        ...state.attributeStyles,
        [attributeId]: style,
      },
    })),

  setItemViewStyle: (viewId: string, style: any) =>
    set((state) => ({
      itemViewStyles: {
        ...state.itemViewStyles,
        [viewId]: style,
      },
    })),

  setDetailViewStyle: (viewId: string, style: any) =>
    set((state) => ({
      detailViewStyles: {
        ...state.detailViewStyles,
        [viewId]: style,
      },
    })),

  setOverviewStyle: (overviewId: string, style: any) =>
    set((state) => ({
      overviewStyles: {
        ...state.overviewStyles,
        [overviewId]: style,
      },
    })),
}));
