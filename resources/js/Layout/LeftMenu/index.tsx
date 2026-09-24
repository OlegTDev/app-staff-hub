import { Menu, MenuProps, theme } from "antd";
import { HomeIcon, UserRoundCog } from "lucide-react";
import { FileTextOutlined, HomeOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import { router } from "@inertiajs/react";
import { useAuth } from "@/hooks/useAuth";

export type MenuItem = Required<MenuProps>['items'][number] & { link?: string, hide?: boolean, children?: MenuItem[] };

export function LeftMenu() {
  const { token } = theme.useToken();
  const { hasRole } = useAuth();
  const iconSize = token.fontSize;

  const menuItems: MenuItem[] = [
    {
      key: 'home',
      label: 'Главная',
      icon: <HomeIcon size={iconSize} />,
      onClick: () => router.get('/'),
      hide: !hasRole('admin'),
    },
    {
      key: 'users',
      label: 'Пользователи',
      icon: <UserRoundCog size={iconSize} />,
      onClick: () => router.get(route('users.index')),
    },
    {
      key: 'resort-treatment',
      icon: <MedicineBoxOutlined size={iconSize} />,
      label: 'Санаторно-курортное лечение',
      children: [
        {
          key: 'sanatoriums',
          icon: <HomeOutlined size={iconSize} />,
          label: 'Санатории',
          onClick: () => router.get(route('dictionary.sanatoriums.index')),
        },
        {
          key: 'applications',
          icon: <FileTextOutlined size={iconSize} />,
          label: 'Заявления',
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems
    .filter((item) => !item.hide)
    .map(({ hide , ...rest }) => rest);

  return (
    <Menu mode="inline" items={filteredMenuItems} defaultSelectedKeys={['home']} />
  );
}
