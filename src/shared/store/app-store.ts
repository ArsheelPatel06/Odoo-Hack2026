import { create } from "zustand";

type AppState = {
  activeModule: string | null;
  setActiveModule: (module: string | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  activeModule: null,
  setActiveModule: (module) => set({ activeModule: module })
}));
