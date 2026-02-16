import { create } from "zustand";
import { Attribute } from "./data-upload.store";
import { Role } from "meridian-ui";

interface DragStore {
  draggedItem: Attribute | null;
  setDraggedItem: (item: Attribute | null) => void;

  roleToDropOn: Role | null;
  setRoleToDropOn: (role: Role | null) => void;
}

export const useDragStore = create<DragStore>((set) => ({
  draggedItem: null,
  setDraggedItem: (item) => set({ draggedItem: item }),

  roleToDropOn: "",
  setRoleToDropOn: (role) => set({ roleToDropOn: role })
}));