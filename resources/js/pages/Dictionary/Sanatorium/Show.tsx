import { Head } from "@inertiajs/react";
import { Sanatorium, SanatoriumLabels } from "./types";
import getSvgPlaceholder from "@/Shared/SvgPlaceholder";
import Title from "@/Shared/Title";
import { Card, Col, Descriptions, Image, Row, theme } from "antd";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

interface PageProps {
  sanatorium: Sanatorium;
  labels: SanatoriumLabels;
};

export default function Show({ sanatorium, labels }: PageProps): React.JSX.Element {
  const title = sanatorium.name;
  const { token } = theme.useToken();
  usePageBreadcrumbs([
    { title: "Главная", href: route('main') },
    { title: "Санаторно-курортное лечение", href: route('dictionary.sanatoriums.index') },
    { title },
  ]);

  return <>
    <Head title={title} />

    {/* <Breadcrumbs items={[
      { title: 'Санатории', href: route('dictionary.sanatoriums.index') },
      { title: title },
    ]} /> */}

    <Title level={2} text={title} />

    <Row gutter={[20, 0]}>
      <Col span={8}>
        <Image
          src={sanatorium.photo_thumbnail}
          fallback={getSvgPlaceholder({ text: "Изображение не загружено" })}
          style={{ border: `1px solid ${token.colorBorder}`, borderRadius: token.borderRadius, width: '100%' }}
        />
      </Col>
      <Col span={16}>
        <Descriptions
          title="Подробнее"
          bordered
          items={[
            { label: labels.city, children: sanatorium.city, span: 'filled' },
            { label: labels.address, children: sanatorium.address, span: 'filled' },
            { label: labels.infrastructure, children: sanatorium.infrastructure.join(', '), span: 'filled' },
            { label: labels.services, children: sanatorium.services.join(', '), span: 'filled' },
            { label: labels.description, children: sanatorium.description, span: 'filled' },
        ]} />
      </Col>

      {sanatorium.photos.length > 0 && (
        <Col span={24}>
          <Card
            title="Галерея"
            type="inner"
            style={{ marginTop: token.marginXL }}
          >
            <Row gutter={[16, 16]}>
              {sanatorium.photos.map((photo) => (
                <Col key={photo.id}>
                  <Image
                    src={photo.thumb_file}
                    preview={{ src: photo.photo_file }}
                    style={{ border: `1px solid ${token.colorBorder}`, borderRadius: token.borderRadius }}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      )}
    </Row>
  </>;
}
