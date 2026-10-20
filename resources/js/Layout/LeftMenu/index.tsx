import { Menu, MenuProps, theme } from "antd";
import { HomeIcon, UserRoundCog } from "lucide-react";
import {
  FileTextOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import { router, usePage } from "@inertiajs/react";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { menuConfig, childToParentMap, routeKeyMap, MenuItemConfig } from "./menuConfig";

export type MenuItem = Required<MenuProps>['items'][number] & {
  hide?: boolean;
  children?: MenuItem[];
};

const icons: Record<string, React.ReactNode> = {
  home: <HomeIcon size={16} />,
  users: <UserRoundCog size={16} />,
  dictionary: <BookOutlined size={16} />,
  torm: <BuildOutlined size={16} />,
  'resort-treatment': <MedicineBoxOutlined size={16} />,
  sanatoriums: <HomeOutlined size={16} />,
  applications: <FileTextOutlined size={16} />,
};

function hasAccess(
  item: MenuItemConfig,
  hasRole: (r: string) => boolean
): boolean {
  if (!item.roles) return true;
  return item.roles.some((r) => hasRole(r));
}

function buildMenuItems(
  config: typeof menuConfig,
  hasRole: (r: string) => boolean,
  iconSize: number
): MenuItem[] {
  return config
    .filter((item) => hasAccess(item, hasRole))
    .map(({ roles, children, ...item }) => ({
      ...item,
      icon: icons[item.key],
      onClick: () => {
        if (item.route) router.get(item.route);
      },
      children: children ? buildMenuItems(children, hasRole, iconSize) : undefined,
    }));
}

function getSelectedKey(path: string): string[] {
  const cleanPath = path.split('?')[0];
  const key = routeKeyMap[cleanPath];
  if (key) return [key];
  const entries = Object.entries(routeKeyMap).sort(
    ([a], [b]) => b.length - a.length
  );
  for (const [menuPath, menuKey] of entries) {
    if (cleanPath.startsWith(menuPath)) return [menuKey];
  }
  return [];
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

  const menuItems = useMemo(
    () => buildMenuItems(menuConfig, hasRole, iconSize),
    [hasRole, iconSize]
  );

  return (
    <Menu
      mode="inline"
      items={menuItems}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={setOpenKeys}
    />
  );
}
