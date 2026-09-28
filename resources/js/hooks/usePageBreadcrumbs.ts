import { BreadcrumbItem, useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { useEffect } from "react";

export function usePageBreadcrumbs(items: BreadcrumbItem[]) {
  const setBreadcrumbs = useBreadcrumbsStore((state) => state.setBreadcrumbs);
  const clearBreadcrumbs = useBreadcrumbsStore((store) => store.clearBreadcrumbs);

  useEffect(() => {
    setBreadcrumbs(items);

    return () => {
      clearBreadcrumbs();
    };
  }, []);
};
