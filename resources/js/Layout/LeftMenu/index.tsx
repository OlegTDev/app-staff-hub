import { Menu, MenuProps, theme } from "antd";
import { HomeIcon, UserRoundCog } from "lucide-react";
import { FileTextOutlined, HomeOutlined, MedicineBoxOutlined, BookOutlined, BuildOutlined } from "@ant-design/icons";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export type MenuItem = Required<MenuProps>['items'][number] & { link?: string, hide?: boolean, children?: MenuItem[] };

const routeKeyMap: Record<string, string> = {
  '/': 'home',
  '/users': 'users',
  '/dictionary/torms': 'torm',
  '/dictionary/sanatoriums': 'sanatoriums',
  '/documents/sanatoriums': 'applications',
};

const childToParentMap: Record<string, string> = {
  torm: 'dictionary',
  sanatoriums: 'resort-treatment',
  applications: 'resort-treatment',
};

function getSelectedKey(url: string): string[] {
  const path = url.split('?')[0];
  const key = routeKeyMap[path];
  return key ? [key] : [];
}

function getOpenKeys(selectedKey: string[]): string[] {
  const key = selectedKey[0];
  if (!key) return [];
  const parent = childToParentMap[key];
  return parent ? [parent] : [];
}

export function LeftMenu() {
  const { token } = theme.useToken();
  const { hasRole } = useAuth();
  const iconSize = token.fontSize;
  const url = usePage().url;
  const selectedKeys = useMemo(() => getSelectedKey(url), [url]);
  const [openKeys, setOpenKeys] = useState<string[]>(getOpenKeys(selectedKeys));

  const autoOpenKeys = useMemo(() => getOpenKeys(selectedKeys), [selectedKeys]);

  useEffect(() => {
    setOpenKeys((prev) => {
      if (prev.length === autoOpenKeys.length && prev.every((k, i) => k === autoOpenKeys[i])) {
        return prev;
      }
      return autoOpenKeys;
    });
  }, [autoOpenKeys]);

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
      key: 'dictionary',
      label: 'Справочники',
      icon: <BookOutlined size={iconSize} />,
      hide: !hasRole('admin'),
      children:[{
        key: 'torm',
        label: 'Список ТОРМ',
        icon: <BuildOutlined size={iconSize} />,
        onClick: () => router.get(route('dictionary.torms.index')),
      }],
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
          onClick: () => router.get(route('documents.sanatoriums.index')),
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems
    .filter((item) => !item.hide)
    .map(({ hide , ...rest }) => rest);

  return (
    <Menu
      mode="inline"
      items={filteredMenuItems}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={setOpenKeys}
    />
  );
}
