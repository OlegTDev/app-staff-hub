import { Head, router } from "@inertiajs/react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Torm, TormLabels } from "./types";
import { BaseFilters, PaginatedData } from "@/types/pagination";
import { useDataTable } from "@/hooks/useDataTable";
import { formatDate } from "@/utils/dateHelpers";
import { useState } from "react";
import Title from "@/Shared/Title";
import { Button, Modal, Space, Tooltip, Table, Flex, Input, Drawer, TableProps } from "antd";
import { ColumnsType } from "antd/es/table";
import Form from "./Form";

const title = 'Список ТОРМ';


interface TableHeaderProps {
  table: ReturnType<typeof useDataTable<Torm>>;
  handleCreateClick: () => void;
}
const TableHeader = ({ table, handleCreateClick }: TableHeaderProps) => {
  return (
    <Flex justify="space-between">
      <Button onClick={handleCreateClick} type="primary">Добавить</Button>
      <Input.Search
        placeholder="Поиск..."
        allowClear
        style={{ maxWidth: 400 }}
        enterButton={<Button type="default">Найти</Button>}
        loading={table.loading}
        defaultValue={table.search}
        onSearch={(value) => table.handleSearchChange(value)}
        onChange={(e) => {
          if (!e.target.value) {
            table.handleSearchChange('');
          }
        }}
      />
    </Flex>
  );
};


interface PageProps {
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
  const [openForm, setOpenForm] = useState(false);
  const { confirm } = Modal;

  const handleCreateClick = () => {
    setSelectedTorm(undefined);
    setOpenForm(true);
  };

  const handleDeleteUser = (torm: Torm) => {
    confirm({
      title: 'Удаление ТОРМ',
      icon: <DeleteOutlined />,
      content: 'Вы уверены, что хотите удалить ТОРМ?',
      onOk() {
        router.delete(route('dictionary.torms.destroy', { id: torm.id }));
      },
    });
  };

  const handleTableChange: TableProps<Torm>['onChange'] = (pagination, _, sorter, extra) => {
    if (extra.action === 'paginate') {
      if (pagination.current !== undefined) {
        table.setPage(pagination.current);
      }
    }

    if (extra.action === 'sort') {
      if (!Array.isArray(sorter)) {
        table.setSortStatus({
          column: sorter.field?.toString(),
          direction: sorter.order !== undefined ? (sorter.order === 'ascend' ? 'asc' : 'desc') : undefined,
        });
      }
    }
  };

  const columns: ColumnsType<Torm> = [
    {
      title: labels.id,
      dataIndex: 'id',
    },
    {
      title: labels.code,
      dataIndex: 'code',
      sorter: true,
    },
    {
      title: labels.name,
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: labels.created_at,
      dataIndex: 'created_at',
      sorter: true,
      render: (value: string) => {
        return formatDate(value);
      },
    },
    {
      title: 'Управление',
      render: (record: Torm) => (
        <Space>
          <Tooltip title="Редактирование">
            <Button icon={<EditOutlined />} onClick={() => { setSelectedTorm(record); setOpenForm(true); }} />
          </Tooltip>
          <Tooltip title="Удалить" color="red">
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteUser(record)} />
          </Tooltip>
        </Space>
      ),
      width: 85,
    },
  ];

  return <>
    <Drawer
      title={selectedTorm ? 'Редактировать ТОРМ' : 'Добавить ТОРМ'}
      open={openForm}
      onClose={() => { setOpenForm(false); setSelectedTorm(undefined); }}
      destroyOnHidden
    >
      <Form
        torm={selectedTorm}
        labels={labels}
        onSuccess={() => setOpenForm(false)}
        route={selectedTorm ? route('dictionary.torms.update', { torm: selectedTorm.id }) : route('dictionary.torms.store')}
        method={selectedTorm ? 'PUT' : 'POST'}
      />
    </Drawer>

    <Head title={title} />

    <Title level={2} text={title} />

    <Table<Torm>
      columns={columns}
      rowKey={(record) => record.id}
      dataSource={items.data}
      pagination={{
        current: items.current_page,
        pageSize: items.per_page,
        total: items.total,
      }}
      loading={table.loading}
      onChange={handleTableChange}
      bordered
      title={() => <TableHeader handleCreateClick={handleCreateClick} table={table} />}
    />
  </>;
};
