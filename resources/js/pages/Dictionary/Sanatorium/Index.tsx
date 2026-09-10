import { BaseFilters, PaginatedData } from "@/types/pagination";
import { Sanatorium, SanatoriumLabels } from "./types";
import { useDataTable } from "@/hooks/useDataTable";
import { Head, router } from "@inertiajs/react";
import { ActionIcon, Button, Center, Group, Title, Tooltip } from "@mantine/core";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { formatDate } from "@/utils/dateHelpers";
import { useAuth } from "@/hooks/useAuth";
import { IconClick, IconEditCircle, IconTrash } from "@tabler/icons-react";
import { useCallback } from "react";
import { modals } from "@mantine/modals";

const title = "Санатории";

type PageProps = {
  items: PaginatedData<Sanatorium>;
  query: BaseFilters;
  labels: SanatoriumLabels;
};

export default function Index({
  items,
  query,
  labels,
}: PageProps): React.JSX.Element {
  const table = useDataTable<Sanatorium>({
    routeName: route("dictionary.sanatoriums.index"),
    items,
    query,
  });
  const { isAdmin, roles } = useAuth();
  const isAuthor = isAdmin || roles.includes('moderator-resort');

  const handleCreateClick = () => {
    router.get(route('dictionary.sanatoriums.create'));
  };

  const renderActions: DataTableColumn<Sanatorium>['render'] = useCallback((record) => (
       <Group gap={4} justify="right" wrap="nowrap">
        <ActionIcon
          size="sm"
          variant="transparent"
          color="green"
          onClick={(e) => {
            e.stopPropagation();
            router.get(route('dictionary.sanatoriums.edit', { sanatorium: record.id }));
          }}
        >
          <Tooltip label="Редактирование">
            <IconEditCircle size={16} />
          </Tooltip>
        </ActionIcon>
        <ActionIcon
        size="sm"
        variant="transparent"
        color="red"
        onClick={(e) => {
          e.stopPropagation();
          modals.openConfirmModal({
            title: 'Удаление санатория',
            children: 'Вы уверены, что хотите удалить санаторий?',
            labels: { confirm: 'Удалить', cancel: 'Отмена' },
            confirmProps: { color: 'red' },
            onConfirm: () => router.delete(route('dictionary.sanatoriums.destroy', { id: record.id })),
          });
        }}
      >
        <IconTrash size={16} />
      </ActionIcon>
       </Group>
    ), []);

  return (
    <>
      <Head title={title} />

      <Title order={1}>{title}</Title>

      {isAuthor && (
        <Button type="button" mb="md" onClick={handleCreateClick}>
          Добавить
        </Button>
      )}

      <DataTable<Sanatorium>
        withTableBorder
        records={table.records}
        minHeight={150}
        noRecordsText="Нет данных"
        columns={[
          { accessor: "id", title: labels.id, sortable: false, width: 70 },
          { accessor: "name", title: labels.name, sortable: true },
          { accessor: "city", title: labels.city, sortable: true },
          {
            accessor: "created_at",
            title: labels.created_at,
            sortable: false,
            render: (record: Sanatorium) => {
              return formatDate(record.created_at);
            },
          },
          { accessor: 'actions', title: (<Center><IconClick size={16} /></Center>), render: renderActions },
        ]}
        fetching={table.loading}
        totalRecords={table.totalRecords}
        recordsPerPage={table.perPage}
        page={table.page}
        onPageChange={table.setPage}
        sortStatus={table.sortStatus}
        onSortStatusChange={table.setSortStatus}
      />
    </>
  );
}
