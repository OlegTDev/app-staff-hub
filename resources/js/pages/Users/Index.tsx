import { ActionIcon, Badge, Button, Center, Drawer, Group, Stack, TextInput, Title } from "@mantine/core";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { Role, User, UserLabels } from "./types";
import { Head, router } from "@inertiajs/react";
import { BaseFilters, PaginatedData } from "@/types/pagination";
import { useDataTable } from "@/hooks/useDataTable";
import { IconClick, IconEdit, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { formatDate } from "@/utils/dateHelpers";
import { useDisclosure } from "@mantine/hooks";
import Form from "./Form";
import { useState } from "react";

type PageProps = {
  items: PaginatedData<User>;
  query: BaseFilters;
  labels: UserLabels;
};

const title = 'Пользователи';

export default function Index({ items, query, labels }: PageProps): React.JSX.Element {
  const table = useDataTable<User>({
    routeName: route('users.index'),
    items,
    query,
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<User|undefined>();

  const handleCreateClick = () => {
    setSelectedUser(undefined);
    open();
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    open();
  };

  const renderActions: DataTableColumn<User>['render'] = (record) => (
    <Group gap={4} justify="right" wrap="nowrap">
      <ActionIcon
        size="sm"
        variant="transparent"
        color="green"
        onClick={(e) => {
          e.stopPropagation();
          handleEditClick(record);
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

  const onSuccess = () => {
    close();
  };


  return <>
    <Drawer opened={opened} onClose={close} title={title}>
      <Form labels={labels} user={selectedUser} onSuccess={onSuccess} />
    </Drawer>

    <Head title={title} />
    <Title order={1}>{title}</Title>

    <TextInput
      placeholder="Поиск..."
      value={table.search}
      onChange={(e) => table.handleSearchChange(e.target.value)}
      mb="md"
    />

    <Button type="button" mb="md" onClick={handleCreateClick}>
      Добавить
    </Button>

    <DataTable<User>
      withTableBorder
      records={table.records}
      columns={[
        { accessor: 'id', title: labels.id, sortable: false, width: 70 },
        { accessor: 'login', title: labels.login, sortable: true },
        { accessor: 'name', title: labels.name, sortable: true },
        { accessor: 'department', title: labels.department, sortable: true },
        { accessor: 'position', title: labels.position, sortable: true },
        {
          accessor: 'roles',
          title: labels.roles,
          render: (record: User) => (
            <Stack gap="xs">
              { record.roles.map((role: Role) => (<Badge key={role.id}>{role.name}</Badge>)) }
            </Stack>
          ),
        },
        { accessor: 'email', title: labels.email, sortable: true },
        { accessor: 'created_at', title: labels.created_at, sortable: true,
          render: (record: User) => {
            return formatDate(record.created_at);
          }
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
  </>;
}
