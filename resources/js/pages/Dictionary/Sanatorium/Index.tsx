import { PaginatedData } from "@/types/pagination";
import { Sanatorium, SanatoriumLabels } from "./types";
import { Head, router } from "@inertiajs/react";
import { useAuth } from "@/hooks/useAuth";
import {
  IconDots,
  IconEdit,
  IconFileX,
  IconLibraryPhoto,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import getSvgPlaceholder from "@/Shared/SvgPlaceholder";
import { useRef, useState } from "react";
import Title from "@/Shared/Title";
import { Button, Card, Col, Dropdown, Empty, Modal, Row, Space, theme } from "antd";
import SafeImage from "@/Shared/SafeImage";
import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

const title = "Санатории";
const { Meta } = Card;

interface PageProps {
  items: PaginatedData<Sanatorium>;
  labels: SanatoriumLabels;
}

export default function Index({ items }: PageProps): React.JSX.Element {
  const { isAdmin, roles } = useAuth();
  const isAuthor = isAdmin || roles.includes("moderator-resort");
  const { token } = theme.useToken();
  const { confirm } = Modal;
  usePageBreadcrumbs([
    { title: "Главная", href: route('main') },
    { title: "Санаторно-курортное лечение" },
  ]);

  const handleSanatoriumCreate = () => {
    router.get(route("dictionary.sanatoriums.create"));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sanatoriumId, setSanatoriumId] = useState<number>(0);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sanatoriumId) {
      return;
    }
    router.post(
      route("dictionary.sanatoriums.images.store", { sanatorium: sanatoriumId }),
      { photo_thumbnail: file },
      {
        forceFormData: true,
        onSuccess: () => router.reload(),
      },
    );
  };

  const handleImageDelete = (id: number) => {
    confirm({
      title: 'Удаление изображения',
      icon: <DeleteOutlined />,
      content: 'Вы уверены, что хотите удалить изображение?',
      onOk() {
        router.delete(route('dictionary.sanatoriums.images.destroy', { sanatorium: id }));
      },
    });
  };

  const handleSanatoriumDelete = (id: number) => {
    confirm({
      title: 'Удаление санатория',
      icon: <DeleteOutlined />,
      content: 'Вы уверены, что хотите удалить санаторий?',
      onOk() {
        router.delete(route('dictionary.sanatoriums.destroy', { sanatorium: id }));
      },
    });
  };

  const cardActions = (id: number): React.ReactNode[] => {
    const actions: React.ReactNode[] = [
      <Button key="1" type="primary" onClick={() => router.get(route('dictionary.sanatoriums.show', { sanatorium: id }))}>Подробнее</Button>,
    ];
    if (isAuthor) {
      actions.push(
        <Dropdown menu={{ items: [
          { key: '3', label: 'Карточка санатория', type: 'group', children: [
            { key: '3-1', label: 'Редактировать', onClick: () => router.get(route('dictionary.sanatoriums.edit', { sanatorium: id })) },
            { key: '3-2', label: 'Удалить', danger: true, onClick: () => handleSanatoriumDelete(id) },
          ]},
          { type: 'divider' },
          { key: '1', label: 'Главное изображение', type: 'group', children: [
          {
            key: '1-1',
            label: 'Загрузить',
            onClick: () => {
              setSanatoriumId(id);
              fileInputRef.current?.click();
            },
          },
            { key: '1-2', label: 'Удалить', danger: true, onClick: () => handleImageDelete(id) },
          ]},
          { type: 'divider' },
          { key: '2', label: 'Галерея', type: 'group', children: [
            { key: '2-1', label: 'Управление изображениями', onClick: () => router.get(route("dictionary.sanatoriums.images.show", { sanatorium: id })) },
          ]},

        ] }}>
          <Button key="settings" icon={<SettingOutlined />} />
        </Dropdown>
      );
    }

    return actions;
  };

  return (
    <>
      <Head title={title} />
      <Title level={2} text={title} />

      {isAuthor && (
        <Space>
          <Button type="primary" onClick={handleSanatoriumCreate}>
            Добавить
          </Button>
        </Space>
      )}

      {items.data.length > 0 ? (
        <Row gutter={[32, 32]} style={{ marginTop: 20 }}>
          {items.data.map((sanatorium: Sanatorium) => (
            <Col span={8} key={sanatorium.id}>
              <Card
                type="inner"
                cover={(
                  <SafeImage
                    // draggable={false}
                    src={sanatorium.photo_thumbnail}
                    fallback={getSvgPlaceholder({ text: "Изображение не загружено" })}
                  />
                )}
                actions={cardActions(sanatorium.id)}
              >
                <Meta title={sanatorium.name} description={sanatorium.city} />
                <div style={{ marginTop: token.paddingMD }}>
                  {sanatorium.description}
                </div>
              </Card>
          </Col>
          ))}
        </Row>
      ) : (
        <Empty />
      )}

      {/* <Grid mb={20}>
        {items.data.length === 0 && <Text>Нет данных</Text>}
        {items.data.map((record: Sanatorium) => (
          <Grid.Col span={4} key={record.id}>
            <Card withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Image
                  src={record.photo_thumbnail}
                  fallbackSrc={getSvgPlaceholder({
                    text: "Изображение не загружено",
                  }
                  )}
                />
              </Card.Section>
              <Group mt="sm" justify="space-between">
                <div>
                  <Text fw={500} size="lg">
                    {record.name}
                  </Text>
                  <Text c="dimmed" size="sm">
                    {record.city}
                  </Text>
                  <Button type="button" mt={10} onClick={() => handleSanatoriumShow(record.id)}>Подробнее</Button>
                </div>
                {isAuthor && (
                  <Menu withinPortal position="bottom-end" shadow="sm">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Label>Главное изображение</Menu.Label>
                      <Menu.Item
                        leftSection={<IconUpload size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSanatoriumId(record.id);
                          fileInputRef.current?.click();
                        }}
                      >
                        Загрузить
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconFileX size={16} />}
                        onClick={(e) => handleImageDelete(e, record.id)}
                      >
                        Удалить
                      </Menu.Item>

                      <Menu.Divider />

                      <Menu.Label>Галерея</Menu.Label>
                      <Menu.Item
                        leftSection={<IconLibraryPhoto size={16} />}
                        onClick={(e) => handleImageManage(e, record.id)}
                      >
                        Управление изображениями
                      </Menu.Item>

                      <Menu.Divider />

                      <Menu.Label>Карточка санатория</Menu.Label>
                      <Menu.Item
                        leftSection={<IconEdit size={16} />}
                        onClick={(e) => handleSanatoriumEdit(e, record.id)}
                      >
                        Редактировать
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={16} />}
                        onClick={(e) => handleSanatoriumDelete(e, record.id)}
                      >
                        Удалить
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid> */}

      {/* {items.last_page > 1 && (
        <Pagination
          total={items.last_page}
          value={items.current_page}
          onChange={(page) => {
            const index = page;
            const link =
              items.links[index]?.url ?? route("dictionary.sanatoriums.index");
            router.get(link);
          }}
        />
      )} */}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </>
  );
}
