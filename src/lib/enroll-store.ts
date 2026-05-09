import { create } from "zustand";

interface EnrollStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useEnrollStore = create<EnrollStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
