import { FetchedItemType } from "../spec/spec.internal";
import { ZustandGet, ZustandSet } from "./odi.store";

export interface ODINavigationStore {

  // ---- DEFAULT ----
  closeDetail: () => void;

  // ---- NEW PAGE ----
  onOpenDetailNewPage?: (item: FetchedItemType) => void;
  onOpenOverviewNewPage?: () => void;

  setOnOpenNewPage: (newPageFunctions: {
    onOpenDetailNewPage?: (item: FetchedItemType) => void;
    onOpenOverviewNewPage?: () => void;
  }) => void;
}

export const createODINavigationStore = (set: ZustandSet, get: ZustandGet): ODINavigationStore => ({

  // ---- DEFAULT ----
  closeDetail: () => set((state) => {
    const detail = state.selectedItemEntity?.detail;
    if (detail) {
      if (detail.openIn === "new-page") {
        state.onOpenOverviewNewPage && state.onOpenOverviewNewPage();
      } else {
        state.clearSelectedItemEntity();
      }
    } else {
      // Everything otherwise? Nothing otherwise? Default otherwise
      state.clearSelectedItemEntity();
      state.onOpenOverviewNewPage && state.onOpenOverviewNewPage();
    }
    return {};
  }),

  // ---- NEW PAGE ----
  onOpenDetailNewPage: undefined,
  onOpenOverviewNewPage: undefined,
  setOnOpenNewPage: ({onOpenDetailNewPage, onOpenOverviewNewPage}) => set({onOpenDetailNewPage, onOpenOverviewNewPage }),
});