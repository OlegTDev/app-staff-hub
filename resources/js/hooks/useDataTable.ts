import { BaseFilters, PaginatedData } from "@/types/pagination";
import { router } from "@inertiajs/react";
import { DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";

interface UseDataTableOptions<T> {
  routeName: string;
  items: PaginatedData<T>;
  query: BaseFilters;
}

export function useDataTable<T>({ routeName, items, query }: UseDataTableOptions<T>) {
  const [page, setPage] = useState(items.current_page);
  const [perPage, setPerPage] = useState(items.per_page);
  const [search, setSearch] = useState(query?.search || '');
  const [loading, setLoading] = useState(false);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<any>>({
    columnAccessor: query?.sortField || 'id',
    direction: (query?.sortDirection as 'asc' | 'desc') || 'asc',
  });

  useEffect(() => {

    const backendSearch = query?.search ?? '';
    const backendSortField = query?.sortField ?? 'id';
    const backendSortDirection = query?.sortDirection ?? 'asc';

    const isSame =
      page === items.current_page &&
      perPage === items.per_page &&
      search === backendSearch &&
      sortStatus.columnAccessor === backendSortField &&
      sortStatus.direction === backendSortDirection;

    if (isSame) return;

    setLoading(true);

    const delayDebounce = setTimeout(() => {
      router.get(
        routeName,
        {
          page,
          perPage,
          search,
          sortField: sortStatus.columnAccessor as string,
          sortDirection: sortStatus.direction,
        },
        {
          preserveState: true,
          preserveScroll: true,
          only: ['items', 'filters'],
          onFinish: () => setLoading(false),
        },
      );
  }, 300);

    return () => {
      clearTimeout(delayDebounce);
      setLoading(false);
    }
  }, [page, perPage, search, sortStatus, routeName]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    handleSearchChange,
    sortStatus,
    setSortStatus,
    records: items.data,
    totalRecords: items.total,
    loading,
  };
}
