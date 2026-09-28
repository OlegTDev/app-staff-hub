import { Head } from "@inertiajs/react";
import { Sanatorium, SanatoriumLabels } from "./types";
// import Breadcrumbs from "@/Shared/Breadcrumbs";
import Form from "./Form";
import Title from "@/Shared/Title";

type PageProps = {
  sanatorium: Sanatorium;
  labels: SanatoriumLabels;
};

export default function Edit({ sanatorium, labels }: PageProps): React.JSX.Element {
  const title = `Изменения санатория ${sanatorium.name}`;

  return (
    <>
      <Head title={title} />

      {/* <Breadcrumbs items={[
        { title: 'Санатории', href: route('dictionary.sanatoriums.index') },
        { title: title },
      ]} /> */}

      <Title level={2} text={title} />

      <Form
        model={sanatorium}
        labels={labels}
        method="PUT"
        route={route('dictionary.sanatoriums.update', { sanatorium: sanatorium.id })}
      />
    </>
  );
}
