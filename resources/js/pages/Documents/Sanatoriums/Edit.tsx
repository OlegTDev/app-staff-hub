import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { Sanatorium } from "@/pages/Dictionary/Sanatorium/types";
import Title from "@/Shared/Title";
import { Head } from "@inertiajs/react";
import { Application, ApplicationLabels } from "./types";
import { Index as Form } from "./Form/Index";
import { breadcrumbMain } from "@/pages/breadcrumbsMain";
import { breadcrumbSanatorium } from "./breadcrumbSanatorium";

const title = 'Редактирование заявления';

interface EditProps {
  documentSanatorium: Application;
  sanatoriums: Sanatorium[];
  labels: ApplicationLabels;
  settings: {
    organization: string;
    manager: string;
  };
};

export default function Edit({ documentSanatorium, sanatoriums, labels, settings }: EditProps): React.JSX.Element {

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
        model={{...documentSanatorium, agree: true }}
        labels={labels}
        sanatoriums={sanatoriums}
        actionUrl={route('documents.sanatoriums.update', { id: documentSanatorium.id })}
        isNewRecord={false}
        settings={settings}
      />
    </>
  );
}
