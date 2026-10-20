import { BaseFilters, PaginatedData } from "@/types/pagination";
import { Head, router } from "@inertiajs/react";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tooltip } from "antd";
import { Application, ApplicationLabels } from "./types";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import Title from "@/Shared/Title";
import { formatDate } from "@/utils/dateHelpers";
import { useDataTable } from "@/hooks/useDataTable";

type PageProps = {
  items: PaginatedData<Application>;
  query: BaseFilters;
  labels: ApplicationLabels;
  isModerator: boolean;
}

export default function Index({ items, query, labels, isModerator }: PageProps): React.JSX.Element {
  const title = isModerator ? 'Заявления' : 'Мои заявления';

  usePageBreadcrumbs([
    { title: "Главная", href: route('main') },
    { title: "Санаторно-курортное лечение", href: route('dictionary.sanatoriums.index') },
    { title },
  ]);

  const table = useDataTable<Application>({
    routeName: route('documents.sanatoriums.index'),
    items,
    query,
  });

  const handleDelete = (id: number) => {
    router.delete(route('documents.sanatoriums.destroy', id));
  };

  const columns = [
    { dataIndex: 'id', title: labels.id },
    { dataIndex: 'app_date', title: labels.app_date, render: (value?: string) => formatDate(value) },
    { dataIndex: 'user_name', title: labels.user_name, hidden: !isModerator },
    {
      title: 'Управление',
      render: (record: Application) => (
        <Space>
          <Tooltip title="Просмотр заявления">
            <Button icon={<EyeOutlined />} onClick={() => router.get(route('documents.sanatoriums.show', { id: record.id }))} />
          </Tooltip>
          <Tooltip title="Редактирование">
            <Button icon={<EditOutlined />} onClick={() => {  }} />
          </Tooltip>
          <Popconfirm
            title="Удаление заявления"
            description="Вы уверены, что хотите удалить это заявление?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
      width: 85,
    },
  ];

  return (
    <div>
      <Head title={title} />
      <Title level={2} text={title} />

      <Table<Application>
        rowKey="id"
        dataSource={items.data}
        columns={columns}
        pagination={{
          current: items.current_page,
          pageSize: items.per_page,
          total: items.total,
        }}
        loading={table.loading}
        bordered
      />

      <Button onClick={() => router.get(route('documents.sanatoriums.create'))}>Click me</Button>
    </div>
  );
}
