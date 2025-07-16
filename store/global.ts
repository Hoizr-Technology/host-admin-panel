import { create } from "zustand";

type ToastData = {
  message: string;
  type: "success" | "error" | "warning";
  title?: string;
};

type MenuState = {
  toastData: ToastData | null;
  setToastData: (data: ToastData | null) => void;
  selectedSideBarMenu: string;
  isSidebarExpanded: boolean;
  setSelectedSideBarMenu: (menu: string) => void;
};

const useGlobalStore = create<MenuState>((set) => ({
  toastData: null, // Default toast data
  setToastData: (data: ToastData | null) => set({ toastData: data }),
  selectedSideBarMenu: "dashboard",
  isSidebarExpanded: true,
  setSelectedSideBarMenu: (menu: string) => set({ selectedSideBarMenu: menu }),
  setIsSidebarExpanded: (isExpanded: boolean) =>
    set({ isSidebarExpanded: isExpanded }),
}));

export default useGlobalStore;
