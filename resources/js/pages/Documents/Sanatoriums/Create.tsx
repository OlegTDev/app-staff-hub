import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { Sanatorium } from "@/pages/Dictionary/Sanatorium/types";
import Title from "@/Shared/Title";
import { Head } from "@inertiajs/react";
import { ApplicationLabels } from "./types";
import { Index as Form } from "./Form/Index";
import { breadcrumbMain } from "@/pages/breadcrumbsMain";
import { breadcrumbSanatorium } from "./breadcrumbSanatorium";

const title = 'Создание заявления';

interface CreateProps {
  sanatoriums: Sanatorium[];
  labels: ApplicationLabels;
  settings: {
    organization: string;
    manager: string;
  };
};

export default function Create({ sanatoriums, labels, settings }: CreateProps): React.JSX.Element {

  usePageBreadcrumbs([
    { title: breadcrumbMain.name, href: breadcrumbMain.link },
    { title: breadcrumbSanatorium.name, href: breadcrumbSanatorium.link },
    { title },
  ]);

  return (
    <>
      <Head title={title} />
      <Title level={2} text={title} />

      <Form
        labels={labels}
        sanatoriums={sanatoriums}
        actionUrl={route('documents.sanatoriums.store')}
        isNewRecord={true}
        settings={settings}
      />
    </>
  );
}
