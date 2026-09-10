import { Link } from '@inertiajs/react';
import { Breadcrumbs as BreadcrumbsMantine, Paper } from '@mantine/core';

type PageProps = {
  items: Array<{
    title: string;
    href?: string;
  }>;
};

export default function Breadcrumbs({ items }: PageProps): React.JSX.Element {
  const elements = items.map((item, index) => (
    item.href ? <Link href={item.href} key={index}>{item.title}</Link> : item.title
  ));

  return <Paper p={10} mb={10}>
     <BreadcrumbsMantine>{elements}</BreadcrumbsMantine>
  </Paper>;
}
