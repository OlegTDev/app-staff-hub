import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import Title from "@/Shared/Title";
import { Head } from "@inertiajs/react";
import { Card, Col, Divider, Flex, Row, Space, theme, Typography } from "antd";
import { ApartmentOutlined, FileTextOutlined } from "@ant-design/icons";
import { Link } from "@inertiajs/react";
import { MedicineBoxOutlined } from "@ant-design/icons";

const { Text } = Typography;

const title = 'Главная';

export default function MainIndex(): React.JSX.Element {
  usePageBreadcrumbs([
    { title },
  ]);

  const { token } = theme.useToken();

  return (
    <>
      <Head title={title} />
      <Title level={2} text={title} />

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={20} md={12} lg={8}>
          <Card
            hoverable
          >
            <Text strong style={{ fontSize: 18 }}>
              <MedicineBoxOutlined style={{ marginRight: 10, color: 'green' }} />
              Санаторно-курортное лечение
            </Text>

            <Divider />

            <Flex align="center" justify="center">
              <img src="/images/sanatorium.webp" style={{ width: 300, borderRadius: token.borderRadius }} />
            </Flex>

            <Divider />

            <Space orientation="vertical">
              <Link href={route("dictionary.sanatoriums.index")}>
                <Space>
                  <ApartmentOutlined />
                  <span>Санатории</span>
                </Space>
              </Link>
              <Link href={route("documents.sanatoriums.index")}>
                <Space>
                  <FileTextOutlined />
                  <span>Заявления на санаторно-курортное лечение</span>
                </Space>
              </Link>
            </Space>

          </Card>
        </Col>
      </Row>
    </>
  );
}
