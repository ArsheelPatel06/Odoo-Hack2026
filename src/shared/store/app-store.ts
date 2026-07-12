import { create } from "zustand";

type AppState = {
  activeModule: string | null;
  isGlobalLoading: boolean;
  loadingLabel: string;
  setActiveModule: (module: string | null) => void;
  setGlobalLoading: (isLoading: boolean, label?: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  activeModule: null,
  isGlobalLoading: false,
  loadingLabel: "Loading",
  setActiveModule: (module) => set({ activeModule: module }),
  setGlobalLoading: (isGlobalLoading, label = "Loading") => set({ isGlobalLoading, loadingLabel: label })
}));
