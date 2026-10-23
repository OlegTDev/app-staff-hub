export interface MenuItemConfig {
  key: string;
  label: string;
  route: string; // route name
  path: string; // URL path for active detection
  roles?: string[];
  children?: MenuItemConfig[];
}

export const menuConfig: MenuItemConfig[] = [
  {
    key: 'home',
    label: 'Главная',
    route: route('main'),
    path: '/',
  },
  {
    key: 'users',
    label: 'Пользователи',
    route: route('users.index'),
    path: '/users',
    roles: ['admin'],
  },
  {
    key: 'dictionary',
    label: 'Справочники',
    route: '',
    path: '/dictionary',
    roles: ['admin'],
    children: [
      {
        key: 'torm',
        label: 'Список ТОРМ',
        route: route('dictionary.torms.index'),
        path: '/dictionary/torms',
      },
    ],
  },
  {
    key: 'resort-treatment',
    label: 'Санаторно-курортное лечение',
    route: '',
    path: '',
    children: [
      {
        key: 'sanatoriums',
        label: 'Санатории',
        route: route('dictionary.sanatoriums.index'),
        path: '/dictionary/sanatoriums',
      },
      {
        key: 'applications',
        label: 'Заявления',
        route: route('documents.sanatoriums.index'),
        path: '/documents/sanatoriums',
      },
    ],
  },
];

export const routeKeyMap: Record<string, string> = Object.fromEntries(
  menuConfig.flatMap((item) => [
    [item.path, item.key],
    ...(item.children?.map((child) => [child.path, child.key]) || []),
  ])
);

export const childToParentMap: Record<string, string> = Object.fromEntries(
  menuConfig.flatMap((item) =>
    item.children?.map((child) => [child.key, item.key]) || []
  )
);
