import { Torm, TormLabels } from "./types";
import { Form as FormInertia } from '@inertiajs/react';
import { Button, Input, Space, Form as AntdForm } from "antd";

interface FormProps {
  torm?: Torm;
  labels: TormLabels;
  route: string;
  onSuccess(): void;
  method: 'PUT'|'POST';
};

export default function Form({ torm, labels, onSuccess, route, method = 'POST' }: FormProps): React.JSX.Element {

  return <FormInertia action={route} method={method} onSuccess={onSuccess}>
    {({ errors, processing }) => (
      <AntdForm layout="vertical" component="div" requiredMark={false}>
        <Space orientation="vertical" size={0} style={{ display: "flex" }}>
          <AntdForm.Item
            label={labels.code}
            validateStatus={errors?.code ? "error" : ""}
            help={errors?.code}
          >
            <Input
              placeholder={labels.code}
              name="code"
              defaultValue={torm?.code ?? ''}
            />
          </AntdForm.Item>
          <AntdForm.Item
            label={labels.name}
            validateStatus={errors?.name ? "error" : ""}
            help={errors?.name}
          >
            <Input
              placeholder={labels.name}
              name="name"
              defaultValue={torm?.name ?? ''}
            />
          </AntdForm.Item>

          <Button loading={processing} type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Space>
      </AntdForm>
    )}
  </FormInertia>;
}
