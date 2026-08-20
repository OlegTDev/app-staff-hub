import { ActionIcon, Center, Group, TextInput, Title } from "@mantine/core";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { User } from "./types";
import { Head, router } from "@inertiajs/react";
import { BaseFilters, PaginatedData } from "@/types/pagination";
import { useDataTable } from "@/hooks/useDataTable";
import { IconClick, IconEdit, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";

type PageProps = {
  items: PaginatedData<User>;
  query: BaseFilters;
  labels: {
    id: string;
    name: string;
    email: string;
    login: string;
    company: string;
    department: string;
    position: string;
    telephone: string;
    domain: string;
    created_at: string;
    updated_at: string;
  };
};

const title = 'Пользователи';

export default function Index({ items, query, labels }: PageProps): React.JSX.Element {
  const table = useDataTable<User>({
    routeName: route('users.index'),
    items,
    query,
  });

  console.log(table.loading);

  const renderActions: DataTableColumn<User>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <ActionIcon
        size="sm"
        variant="transparent"
        color="green"
        onClick={(e) => {
          e.stopPropagation();
          router.get(route('users.edit', { id: record.id }));
        }}
      >
        <IconEdit size={16} />
      </ActionIcon>
      <ActionIcon
        size="sm"
        variant="transparent"
        color="red"
        onClick={(e) => {
          e.stopPropagation();
          modals.openConfirmModal({
            title: 'Удаление пользователя',
            children: 'Вы уверены, что хотите удалить пользователя?',
            labels: { confirm: 'Удалить', cancel: 'Отмена' },
            confirmProps: { color: 'red' },
            onConfirm: () => router.delete(route('users.destroy', { id: record.id })),
          });
        }}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  );

  return <>
    <Head title={title} />
    <Title order={1}>{title}</Title>

    <TextInput
      placeholder="Поиск..."
      value={table.search}
      onChange={(e) => table.handleSearchChange(e.target.value)}
      mb="md"
    />

    <DataTable<User>
      withTableBorder
      records={table.records}
      columns={[
        { accessor: 'id', title: labels.id, sortable: false, width: 70 },
        { accessor: 'login', title: labels.login, sortable: true },
        { accessor: 'name', title: labels.name, sortable: true },
        { accessor: 'email', title: labels.email, sortable: true },
        { accessor: 'created_at', title: labels.created_at, sortable: true },
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
  </>;
}
