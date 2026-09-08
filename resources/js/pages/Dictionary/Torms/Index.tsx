import { Head } from "@inertiajs/react";
import { ActionIcon, Button, Center, Drawer, Group, Title, Tooltip } from "@mantine/core";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { Torm, TormLabels } from "./types";
import { BaseFilters, PaginatedData } from "@/types/pagination";
import { useDataTable } from "@/hooks/useDataTable";
import { formatDate } from "@/utils/dateHelpers";
import { IconClick, IconEditCircle } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import Form from "./Form";

const title = 'Список ТОРМ';

type PageProps = {
  items: PaginatedData<Torm>;
  query: BaseFilters;
  labels: TormLabels;
};

export default function Index({ items, query, labels }: PageProps): React.JSX.Element {

  const table = useDataTable<Torm>({
    routeName: route('dictionary.torms.index'),
    items,
    query,
  });

  const [selectedTorm, setSelectedTorm] = useState<Torm|undefined>();
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  const handleCreateClick = () => {
    setSelectedTorm(undefined);
    openDrawer();
  };

  const handleEditClick = (torm: Torm) => {
    setSelectedTorm(torm);
    openDrawer();
  };

  const renderActions: DataTableColumn<Torm>['render'] = useCallback((record) => (
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
        <Tooltip label="Редактирование">
          <IconEditCircle size={16} />
        </Tooltip>
      </ActionIcon>
     </Group>
  ), []);

  return <>
    <Head title={title} />

    <Title order={1}>{title}</Title>

    <Button type="button" mb="md" onClick={handleCreateClick}>
      Добавить
    </Button>

    <Drawer opened={openedDrawer} onClose={closeDrawer} title={selectedTorm ? 'Редактировать ТОРМ' : 'Добавить ТОРМ'}>
      <Form
        torm={selectedTorm}
        labels={labels}
        onSuccess={closeDrawer}
        route={selectedTorm ? route('dictionary.torms.update', { torm: selectedTorm.id }) : route('dictionary.torms.store')}
        method={selectedTorm ? 'PUT' : 'POST'}
      />
    </Drawer>

    <DataTable<Torm>
      withTableBorder
      records={table.records}
      columns={[
        { accessor: 'id', title: labels.id, sortable: false, width: 70 },
        { accessor: 'code', title: labels.code, sortable: true },
        { accessor: 'name', title: labels.name, sortable: true },
        { accessor: 'created_at', title: labels.created_at, sortable: false,
          render: (record: Torm) => {
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

  </>
};
