import Breadcrumbs from "@/Shared/Breadcrumbs";
import { Head } from "@inertiajs/react";
import { Title } from "@mantine/core";
import Form from "./Form";
import { SanatoriumLabels } from "./types";


const title = 'Добавление санатория';

export default function Create({ labels }: { labels: SanatoriumLabels }): React.JSX.Element {
  return <>
    <Head title={title} />

    <Breadcrumbs items={[
      { title: 'Санатории', href: route('dictionary.sanatoriums.index') },
      { title: title },
    ]} />

    <Title order={1}>{title}</Title>

    <Form
      labels={labels}
      method="POST"
      route={route('dictionary.sanatoriums.store')}
    />
  </>;
}
