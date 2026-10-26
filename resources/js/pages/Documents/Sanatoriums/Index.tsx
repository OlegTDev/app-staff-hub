import { BaseFilters, PaginatedData } from "@/types/pagination";
import { Head, router } from "@inertiajs/react";
import { EyeOutlined, EditOutlined, DeleteOutlined, BankTwoTone, IdcardTwoTone, PhoneTwoTone, CalendarFilled, CalendarOutlined } from "@ant-design/icons";
import { Button, Divider, Drawer, Popconfirm, Space, Table, Tag, Tooltip, Typography } from "antd";
import { Application, ApplicationLabels } from "./types";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import Title from "@/Shared/Title";
import { formatDate, formatRelative } from "@/utils/dateHelpers";
import { useDataTable } from "@/hooks/useDataTable";
import { useState } from "react";
import { breadcrumbMain } from '@/pages/breadcrumbsMain';
import { breadcrumbSanatorium } from './breadcrumbSanatorium';
import { INIT_SCALE_SIZE, PdfPreview, ZoomControls } from './PdfPreview';
import { Sanatorium } from "@/pages/Dictionary/Sanatorium/types";

type PageProps = {
  items: PaginatedData<Application>;
  query: BaseFilters;
  labels: ApplicationLabels;
  isModerator: boolean;
  isAdmin: boolean;
}

const SanatoriumRender = ({ sanatorium }: {sanatorium: Sanatorium}) => {
  return (<>
    <Space orientation="vertical" size={0}>
      <Text>{sanatorium.name}</Text>
      <Text type='secondary'>({sanatorium.city})</Text>
    </Space>
  </>);
};

const { Text } = Typography;

export default function Index({ items, query, labels, isModerator, isAdmin }: PageProps): React.JSX.Element {
  const title = isModerator || isAdmin ? breadcrumbSanatorium.name : 'Мои заявления';
  const [pdfPreviewScale, setPdfPreviewScale] = useState(INIT_SCALE_SIZE);

  usePageBreadcrumbs([
    { title: breadcrumbMain.name, href: breadcrumbMain.link },
    { title: breadcrumbSanatorium.name }
  ]);

  const table = useDataTable<Application>({
    routeName: route('documents.sanatoriums.index'),
    items,
    query,
  });

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);

  const handleView = (record: Application) => {
    setSelectedDocumentId(record.document.id);
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedDocumentId(null);
  };

  const handleEdit = (id: number) => {
    router.get(route('documents.sanatoriums.edit', { id }));
  };

  const handleDelete = (id: number) => {
    router.delete(route('documents.sanatoriums.destroy', id));
  };

  const pdfUrl = selectedDocumentId ? route('documents.pdf', { document: selectedDocumentId }) : '';

  const columns = [
    {
      title: labels.user,
      key: 'user_name',
      dataIndex: 'user_name',
      sorter: true,
      render: (_: string, record: Application) => {
        return (
          <>
            <Space orientation="vertical" size={0}>
              <Text>{record.user_name}</Text>
              {record.user_department && <Text type="secondary"><BankTwoTone style={{ marginRight: 5 }} />{record.user_department}</Text>}
              {record.user_position && <Text type="secondary"><IdcardTwoTone style={{ marginRight: 5 }} /> {record.user_position}</Text>}
              {record.user_telephone_inner && <Text type="secondary"><PhoneTwoTone style={{ marginRight: 5 }} /> {record.user_telephone_inner}</Text>}
              <Text ellipsis>Количество путевок: {record.user_relatives.length + 1}</Text>
            </Space>
          </>
        );
      },
    },
    {
      title: labels.sanatorium_id,
      key: 'sanatorium_id',
      dataIndex: 'sanatorium_id',
      sorter: true,
      render: (_: string, record: Application) => {
        return (
          <>
            <SanatoriumRender sanatorium={record?.sanatorium} />
          </>
        );
      },
    },
    {
      title: labels.sanatoriumsAdditional,
      key: 'sanatoriumsAdditional',
      dataIndex: 'sanatoriumsAdditional',
      sorter: true,
      render: (_: string, record: Application) => {
        if (record.sanatoriumsAdditional.length > 0) {
          return <Space orientation="vertical">
            {record.sanatoriumsAdditional.map((sanatorium) => (<SanatoriumRender key={sanatorium.id} sanatorium={sanatorium} />))}
          </Space>;
        }
        return <>Не выбран</>;
      },
    },
    {
      title: labels.vacation_and_arrival_period,
      key: 'vacation_start',
      dataIndex: 'vacation_start',
      sorter: true,
      render: (_: string, record: Application) => {
        return <>
          <Space orientation="vertical">
            <Text strong><CalendarOutlined /><span className='ml-2'> Отпуск:</span></Text>
            <Space orientation="vertical" size={0}>
              <Text>
                {formatDate(record.vacation_start)} - {formatDate(record.vacation_end)}
              </Text>
              <Text type="secondary">({formatRelative(record.vacation_start)})</Text>
            </Space>
            <Divider size="small" />
            <Text strong><CalendarOutlined /><span className='ml-2'> Период заезда:</span></Text>
            {record.any_date_during_vacation ? <Text>Любая дата заезда</Text> :
              <Space orientation="vertical" size={0}>
                <Text>
                  {formatDate(record.arrival_date_from)} - {formatDate(record.arrival_date_to)}
                </Text>
                <Text type="secondary">({formatRelative(record.arrival_date_from)})</Text>
              </Space>
            }
          </Space>
        </>;
      },
    },
    { title: labels.app_date, render: (record: Application) => formatDate(record.app_date) },
    {
      title: labels.status,
      render: (record: Application) => {
        const status = record.document.status;
        if (status === 'new') {
          return <Tag color="default">Черновик</Tag>;
        } else if (status === 'sended') {
          return <Tag color="green">Отправлено</Tag>;
        } else {
          return <Tag color="red">Не известный статус: {status}</Tag>;
        }
      },
    },
    {
      title: 'Управление',
      render: (record: Application) => (
        <Space>
          <Tooltip title="Просмотр заявления">
            <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          {record.can_edit && (
            <Tooltip title="Редактирование">
              <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
            </Tooltip>
          )}
          {record.can_delete && (
            <Popconfirm
              title="Удаление заявления"
              description="Вы уверены, что хотите удалить это заявление?"
              onConfirm={() => handleDelete(record.id)}
              okText="Да"
              cancelText="Нет"
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          )}
        </Space>
      ),
      width: 85,
    },
  ];

  return (
    <>
      <Head title={title} />
      <Title level={2} text={title} />

      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => router.get(route('documents.sanatoriums.create'))}>Создать заявление</Button>
      </div>

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

      <Drawer
        title="Просмотр заявления"
        size={Math.max(600, pdfPreviewScale * 630)}
        placement="right"
        open={drawerVisible}
        onClose={handleCloseDrawer}
        destroyOnHidden
        extra={
          <Space>
            <ZoomControls key={1} scale={pdfPreviewScale} onScaleChange={setPdfPreviewScale} />
            <Button key={2} onClick={() => window.open(pdfUrl, '_blank')}>Скачать</Button>
          </Space>
        }
      >
        {selectedDocumentId &&
          <PdfPreview url={route('documents.pdf', { document: selectedDocumentId })} scale={pdfPreviewScale} />
        }
      </Drawer>
    </>
  );
}
