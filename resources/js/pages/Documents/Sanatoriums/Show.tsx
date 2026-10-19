import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { Application } from './types';
import { useState } from 'react';
import { Button, Card, Col, Divider, Row, Space } from 'antd';
import { usePageBreadcrumbs } from '@/hooks/usePageBreadcrumbs';
import { formatDate } from '@/utils/dateHelpers';
import { Head } from '@inertiajs/react';
import Title from '@/Shared/Title';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type ShowProps = {
  sanatoriumApplication: Application;
  pdfUrl: string;
};

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

export default function Show({ sanatoriumApplication, pdfUrl }: ShowProps): React.JSX.Element {
  const title = `Заявление на санаторно-курортное лечение от ${formatDate(sanatoriumApplication.app_date)}`;

  usePageBreadcrumbs([
    { title: "Главная", href: route('main') },
    { title: "Санаторно-курортное лечение", href: route('dictionary.sanatoriums.index') },
    { title: "Заявления на санаторно-курортное лечение", href: route('documents.sanatoriums.index') },
    { title },
  ]);

  const initSize = 1.2;
  const [scale, setScale] = useState(initSize);

  return (<>
    <Head title={title} />
    <Title level={2} text={title} />

    <Row>
      <Col span={12}>
        <Card>
          <div style={{ display:'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <ZoomControls key={1} initSize={initSize} scale={scale} setScale={setScale} />
            <Button key={2} onClick={() => window.location.href = pdfUrl}>Скачать</Button>
          </div>
          <Divider />
          {pdfUrl ? (
            <>
              <Document
                file={pdfUrl}
                loading={<div>Загрузка...</div>}
              >
                <Page
                  scale={scale}
                  pageNumber={1}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                />
              </Document>
            </>
          ) : <div>Загрузка документа...</div>}
        </Card>
      </Col>
    </Row>
  </>);
};

