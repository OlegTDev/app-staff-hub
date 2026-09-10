import { Head } from "@inertiajs/react";
import { Sanatorium, SanatoriumLabels } from "./types";
import Breadcrumbs from "@/Shared/Breadcrumbs";
import { Title } from "@mantine/core";
import Form from "./Form";

type PageProps = {
  sanatorium: Sanatorium;
  labels: SanatoriumLabels;
};

export default function Edit({ sanatorium, labels }: PageProps): React.JSX.Element {
  const title = `Изменения санатория ${sanatorium.name}`;

  return (
    <>
      <Head title={title} />

      <Breadcrumbs items={[
        { title: 'Санатории', href: route('dictionary.sanatoriums.index') },
        { title: title },
      ]} />

      <Title order={1}>{title}</Title>

      <Form
        model={sanatorium}
        labels={labels}
        method="PUT"
        route={route('dictionary.sanatoriums.update', { sanatorium: sanatorium.id })}
      />
    </>
  );
}
