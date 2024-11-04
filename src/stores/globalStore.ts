import { create } from "zustand";

interface GlobalState {
  isTopupModalOpen: boolean;
  setIsTopupModalOpen: (isOpen: boolean) => void;
}

export const useGlobalStore = create<GlobalState>()((set, get) => ({
  isTopupModalOpen: false,
  setIsTopupModalOpen: (isOpen) => set({ isTopupModalOpen: isOpen }),
}));
