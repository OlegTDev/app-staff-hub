import { Alert, Spin } from "antd";
import { useEffect, useState } from "react";

/** Ширина выдвижной панели предпросмотра (A4 при читаемом масштабе). */
export const PDF_PREVIEW_WIDTH = 900;

type PdfPreviewProps = {
  url: string;
  method?: "GET" | "POST";
  data?: Record<string, unknown>;
};

/**
 * Предпросмотр PDF через встроенный просмотрщик браузера (PDFium).
 * Не требует pdf.js и работает в старых Chromium (Edge 92 и новее).
 */
export function PdfPreview({
  url,
  method = "GET",
  data = {},
}: PdfPreviewProps): React.JSX.Element {

  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>('');

  const stringifiedData = JSON.stringify(data);

  useEffect(() => {
    if (!url) return;

    setIsPdfLoading(true);
    setLoadError('');
    setPdfBlobUrl(null);

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
        // Встроенный просмотрщик открывает только blob с типом application/pdf
        const pdfBlob = blob.type === 'application/pdf'
          ? blob
          : new Blob([blob], { type: 'application/pdf' });

        currentBlobUrl = URL.createObjectURL(pdfBlob);
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
        <iframe
          src={pdfBlobUrl}
          title="Предпросмотр заявления"
          style={{ width: '100%', height: '100%', minHeight: '75vh', border: 0 }}
        />
      )}
    </>
  );
}
