import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Alert, Button, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export const INIT_SCALE_SIZE = 1.2;

type ZoomControlsProps = {
  scale: number;
  initSize?: number;
  onScaleChange: React.Dispatch<React.SetStateAction<number>>;
};

export const ZoomControls = ({
  scale,
  initSize = INIT_SCALE_SIZE,
  onScaleChange,
}: ZoomControlsProps): React.JSX.Element => {
  const zoomIn = () => onScaleChange((prev) => Math.min(prev + 0.1, 3.0));
  const zoomOut = () => onScaleChange((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <Space>
      <Space.Compact>
        <Button onClick={zoomOut}>-</Button>
        <Space.Addon>{Math.round((scale / initSize) * 100)}%</Space.Addon>
        <Button onClick={zoomIn}>+</Button>
      </Space.Compact>
    </Space>
  );
};

type PdfPreviewProps = {
  url: string;
  method?: "GET" | "POST";
  data?: Record<string, any>;
  scale?: number;
};

export function PdfPreview({
  url,
  method = "GET",
  data = {},
  scale = INIT_SCALE_SIZE,
}: PdfPreviewProps): React.JSX.Element {

  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>('');

  const stringifiedData = JSON.stringify(data);

  useEffect(() => {
    if (!url) return;

    setIsPdfLoading(true);
    setLoadError('');

    let currentBlobUrl: string | null = null;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
      },
      body: method === 'POST' ? stringifiedData : undefined,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        // Создаем локальную ссылку для react-pdf
        currentBlobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(currentBlobUrl);
      })
      .catch((err) => {
        setLoadError(`Ошибка загрузки PDF: ${err.message || err}`);
      })
      .finally(() => {
        setIsPdfLoading(false);
      });

    return () => {
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };

  }, [url, method, stringifiedData]);

  return (
    <>
      {loadError && <Alert title={loadError} type="error" showIcon style={{ marginBottom: 16 }} />}

      {isPdfLoading && <Spin description="Генерация документа..." size="large" />}

      {!isPdfLoading && pdfBlobUrl && (
        <Document file={pdfBlobUrl} loading={<div>Генерация документа...</div>}>
          <Page
            pageNumber={1}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      )}
    </>
  );
}
