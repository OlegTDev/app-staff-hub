import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { BaseFilters, PaginatedData } from "@/types/pagination";
import { Head, router } from "@inertiajs/react";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Drawer, Popconfirm, Space, Table, Tooltip } from "antd";
import { Application, ApplicationLabels } from "./types";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import Title from "@/Shared/Title";
import { formatDate } from "@/utils/dateHelpers";
import { useDataTable } from "@/hooks/useDataTable";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import { breadcrumbMain } from '@/pages/breadcrumbsMain';
import { breadcrumbSanatorium } from './breadcrumbSanatorium';


const ZoomControls = ({ scale, setScale, initSize }: {
  scale: number;
  setScale: (value: React.SetStateAction<number>) => void;
  initSize: number;
}): React.JSX.Element => {

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  return (
    <Space>
      <Space.Compact>
        <Button onClick={zoomOut}>-</Button>
        <Space.Addon>{Math.round(scale/initSize * 100)}%</Space.Addon>
        <Button onClick={zoomIn}>+</Button>
      </Space.Compact>
    </Space>
  );
};

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type PageProps = {
  items: PaginatedData<Application>;
  query: BaseFilters;
  labels: ApplicationLabels;
  isModerator: boolean;
}

export default function Index({ items, query, labels, isModerator }: PageProps): React.JSX.Element {
  const title = isModerator ? breadcrumbSanatorium.name : 'Мои заявления';

  usePageBreadcrumbs([
    { title: breadcrumbMain.name, href: breadcrumbMain.link },
    { title: breadcrumbSanatorium.name }
  ]);

  const initSize = 1.2;
  const [scale, setScale] = useState(initSize);

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
    { dataIndex: 'id', title: labels.id },
    { dataIndex: 'app_date', title: labels.app_date, render: (value?: string) => formatDate(value) },
    { dataIndex: 'user_name', title: labels.user_name, hidden: !isModerator },
    {
      title: 'Управление',
      render: (record: Application) => (
        <Space>
          <Tooltip title="Просмотр заявления">
            <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title="Редактирование">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
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
        size={Math.max(600, scale * 630)}
        placement="right"
        open={drawerVisible}
        onClose={handleCloseDrawer}
        destroyOnHidden
        extra={
          <Space>
            <ZoomControls key={1} initSize={initSize} scale={scale} setScale={setScale} />
            <Button key={2} onClick={() => window.open(pdfUrl, '_blank')}>Скачать</Button>
          </Space>
        }
      >
        {pdfUrl ? (
          <div className="pdf-preview-container">
            <Document file={pdfUrl} loading={<div>Загрузка...</div>}>
              <Page
                scale={scale}
                pageNumber={1}
                renderTextLayer={true}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        ) : (
          <div>Загрузка документа...</div>
        )}
      </Drawer>
    </>
  );
}
