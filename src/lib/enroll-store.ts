import { create } from "zustand";

interface EnrollStore {
  isOpen: boolean;
  source: string;
  open: (source?: string) => void;
  close: () => void;
}

export const useEnrollStore = create<EnrollStore>((set) => ({
  isOpen: false,
  source: "sila-slova",
  open: (source = "sila-slova") => set({ isOpen: true, source }),
  close: () => set({ isOpen: false }),
}));
