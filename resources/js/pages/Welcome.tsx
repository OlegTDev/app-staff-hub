import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import Title from "@/Shared/Title";
import { Head } from "@inertiajs/react";

const title = 'Главная';

export default function Welcome(): React.JSX.Element {
  usePageBreadcrumbs([
    { title },
  ]);

  return (
    <>
      <Head title={title} />
      <Title level={2} text={title} />

      {title}
    </>
  );
}
