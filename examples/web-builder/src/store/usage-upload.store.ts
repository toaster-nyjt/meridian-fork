import { UsageSpec } from "@/user-analytics/usage.spec";
import { create } from "zustand";

export interface UsageStore {
  usageData: UsageSpec | null;
  setUsageData: (usageData: UsageSpec) => void;
}

export const useUsageUploadStore = create<UsageStore>((set) => ({
  usageData: null,
  setUsageData: (usageData: UsageSpec) => set({ usageData }),
}));