import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { Sanatorium } from "@/pages/Dictionary/Sanatorium/types";
import Title from "@/Shared/Title";
import { Head } from "@inertiajs/react";
import { ApplicationLabels } from "./types";
import { Index as Form } from "./Form/Index";

const title = 'Создание заявления';

interface CreateProps {
  sanatoriums: Sanatorium[];
  labels: ApplicationLabels;
};

export default function Create({ sanatoriums, labels }: CreateProps): React.JSX.Element {

  usePageBreadcrumbs([
    { title: "Главная", href: route('main') },
    { title: "Санаторно-курортное лечение" },
    { title: "Заявления", href: route('sanatoriums.applications.index') },
    { title },
  ]);

  return (
    <>
      <Head title={title} />
      <Title level={2} text={title} />

      <Form
        labels={labels}
        sanatoriums={sanatoriums}
        actionUrl={route('sanatoriums.applications.store')}
        isNewRecord={true}
      />
    </>
  );
}
