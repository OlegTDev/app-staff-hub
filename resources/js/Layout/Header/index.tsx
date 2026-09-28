import { Button, Dropdown, Flex, Layout, Space, theme } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { router } from "@inertiajs/react";
import { ItemType } from "antd/es/menu/interface";

const { Header: AntHeader } = Layout;

export function Header() {
  const { token } = theme.useToken();
  const iconSize = token.fontSize;
  const { user } = useAuth();

  const userMenuItems: ItemType[] = [
    {
      key: '1',
      label: 'Профиль',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Выход',
      onClick: () => router.delete(route('logout')),
      icon: <LogoutOutlined />
    },
  ];

  return (
    <AntHeader
      style={{
        background: "transparent",
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        padding: `0 ${token.padding}px`,
        gap: token.sizeLG,
        display: "flex",
      }}
    >
      <Flex align="center" flex={1} style={{ minWidth: 0 }}>
        Breadcrumb
      </Flex>
      <Space>
        <Dropdown menu={{ items: userMenuItems }}>
          <Button variant="filled" color="default" icon={<UserOutlined size={iconSize} />}>
            {user?.name}
          </Button>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
