import { createPersistentStore } from "./createPersistentStore";

interface SettingState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
};

export const useSettingStore = createPersistentStore<SettingState>(
  (set) => ({
    sidebarCollapsed: false,
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  }),
  {
    name: 'settings-storage',
    partialize: (state) => ({
      sidebarCollapsed: state.sidebarCollapsed,
    }),
  },
);
