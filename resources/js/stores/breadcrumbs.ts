import { createStore } from "./createPersistentStore";

export interface BreadcrumbItem {
  title: React.ReactNode,
  href?: string;
}

interface BreadcrumbState {
  items: BreadcrumbItem[];
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  clearBreadcrumbs: () => void;
}

export const useBreadcrumbsStore = createStore<BreadcrumbState>(
  (set) => ({
    items: [],
    setBreadcrumbs: (items) => set({ items }),
    clearBreadcrumbs: () => set({ items: [] }),
  }),
);
