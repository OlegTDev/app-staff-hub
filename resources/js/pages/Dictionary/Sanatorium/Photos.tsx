import { Head, router } from "@inertiajs/react";
import { Sanatorium, SanatoriumLabels } from "./types";
import getSvgPlaceholder from "@/Shared/SvgPlaceholder";
import Title from "@/Shared/Title";
import { Button, Card, Col, Image, Modal, Row, Upload } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Gallery from "./Gallery";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

interface PageProps {
  sanatorium: Sanatorium;
  labels: SanatoriumLabels;
};

export default function Photos({ sanatorium, labels }: PageProps): React.JSX.Element {
  const title = 'Управление изображениями';
  const { confirm } = Modal;
  usePageBreadcrumbs([
    { title: "Главная", href: route('main') },
    { title: "Санаторно-курортное лечение", href: route('dictionary.sanatoriums.index') },
    { title: sanatorium.name, href: route('dictionary.sanatoriums.show', { sanatorium: sanatorium.id }) },
    { title },
  ]);

  const handleDeleteGeneralPhoto = () => {
    confirm({
      title: 'Удаление изображения',
      icon: <DeleteOutlined />,
      content: 'Вы уверены, что хотите удалить изображение?',
      onOk() {
        router.delete(route('dictionary.sanatoriums.images.destroy', { sanatorium: sanatorium.id }));
      },
    });
  };

  const handleUploadPhotos = (photo: File): void => {
    router.post(
      route('dictionary.sanatoriums.images.store', { sanatorium: sanatorium.id }),
      { 'images[]': photo },
      {
        forceFormData: true,
      }
    );
  };

  const handleDeletePhoto = (id: number): void => {
    confirm({
      title: 'Удаление изображения',
      icon: <DeleteOutlined />,
      content: 'Вы уверены, что хотите удалить изображение?',
      onOk() {
        router.delete(route('dictionary.sanatoriums.images.destroy-gallery', { sanatoriumPhoto: id }));
      },
    });
  };

  return <>
    <Head title={title} />

    {/* <Breadcrumbs items={[
      { title: 'Санатории', href: route('dictionary.sanatoriums.index') },
      { title: sanatorium.name, href: route('dictionary.sanatoriums.show', { sanatorium: sanatorium.id }) },
      { title: title },
    ]} /> */}

    <Title level={2} text={title} />

    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Card
          title={labels.photo_thumbnail}
          actions={[
            <Upload
              key="upload"
              maxCount={1}
              showUploadList={false}
              action={route('dictionary.sanatoriums.images.store', { sanatorium: sanatorium.id })}
              name="photo_thumbnail"
              onChange={(info) => {
                if (info.file.status === 'done') {
                  router.reload();
                }
              }}
            >
              <Button>Загрузить</Button>
            </Upload>,
            <Button key="delete" disabled={!sanatorium.photo_thumbnail} danger onClick={handleDeleteGeneralPhoto}>Удалить</Button>,
          ]}
        >
          <Image
            src={sanatorium.photo_thumbnail}
            fallback={getSvgPlaceholder({ text: "Изображение не загружено" })}
          />
        </Card>
      </Col>
      <Col span={16}>
        <Card
          title={labels.photos}
        >
          <Gallery photos={sanatorium.photos} onUploadPhoto={handleUploadPhotos} onDeletePhoto={handleDeletePhoto} />
        </Card>
      </Col>
    </Row>

    {/* <Grid mt={20}>
      <Grid.Col span={4}>
        <Card withBorder shadow="sm">
          <Card.Section withBorder inheritPadding py="xs">
            <Title order={4} fw={500}>{labels.photo_thumbnail}</Title>
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            <Paper withBorder radius="md" p={4}>
              <Image
                radius="md"
                src={sanatorium.photo_thumbnail}
                fallbackSrc={getSvgPlaceholder({
                  text: "Изображение не загружено",
                })}
              />
            </Paper>
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <FileButton
                onChange={handleUploadGeneralPhoto}
              >
                {(props) => <Button {...props}>Загрузить главное изображение</Button>}
              </FileButton>

              <Button type="button" color="red" onClick={handleDeleteGeneralPhoto}>Удалить</Button>
            </Group>
          </Card.Section>
        </Card>
      </Grid.Col>
      <Grid.Col span={8}>
        <Card withBorder shadow="sm">
          <Card.Section withBorder inheritPadding py="xs">
            <Title order={4} fw={500}>{labels.photos}</Title>
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            {sanatorium.photos.length > 0 ? (
              <Gallery photos={sanatorium.photos} onDeletePhoto={handleDeletePhoto} />
            ) : (
              <Text>Изображения не загружены.</Text>
            )}
          </Card.Section>
          <Card.Section withBorder inheritPadding py="xs">
            <FileButton
                multiple
                onChange={handleUploadPhotos}
              >
                {(props) => <Button {...props}>Загрузить изображения</Button>}
              </FileButton>
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid> */}

  </>;
}
