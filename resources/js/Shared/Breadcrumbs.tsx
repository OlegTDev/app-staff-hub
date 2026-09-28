import { useBreadcrumbsStore } from '@/stores/breadcrumbs';
import { Link } from '@inertiajs/react';
import { Breadcrumb } from 'antd';


export default function Breadcrumbs(): React.JSX.Element {
  const items = useBreadcrumbsStore((store) => store.items).map((item) => ({ title: item.title, href: item.href }));

  const itemRender = (currentRoute: any, items: any[]) => {
    const isLast = items.indexOf(currentRoute) === items.length - 1;

    if (isLast) {
      return <span>{currentRoute.title}</span>;
    }

    if (currentRoute.href) {
      return (
        <Link
          href={currentRoute.href}
          style={{ color: 'inherit' }}
        >
          {currentRoute.title}
        </Link>
      );
    }

    return <span>{currentRoute.title}</span>;
  };

  return (
    <div className="app-header">
      {items.length > 0 && (
        <Breadcrumb
          items={items}
          itemRender={itemRender}
        />
      )}
    </div>
  );
}
