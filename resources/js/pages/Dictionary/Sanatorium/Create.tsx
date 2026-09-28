// import Breadcrumbs from "@/Shared/Breadcrumbs";
import { Head } from "@inertiajs/react";
// import { Title } from "@mantine/core";
import { SanatoriumLabels } from "./types";
import Title from "@/Shared/Title";
import Form from "./Form";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";


const title = 'Добавление санатория';

export default function Create({ labels }: { labels: SanatoriumLabels }): React.JSX.Element {
  usePageBreadcrumbs([
    { title: "Главная", href: route('main') },
    { title: "Санаторно-курортное лечение", href: route('dictionary.sanatoriums.index') },
    { title },
  ]);

  return <>
    <Head title={title} />
    <Title level={2} text={title} />

    {/* <Breadcrumbs items={[
      { title: 'Санатории', href: route('dictionary.sanatoriums.index') },
      { title: title },
    ]} /> */}


    <Form
      labels={labels}
      method="POST"
      route={route('dictionary.sanatoriums.store')}
    />
  </>;
}
