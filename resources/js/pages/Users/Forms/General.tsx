import { Button, Form, Input, Space, Form as AntdForm } from "antd";
import { Role, User, UserLabels } from "../types";
import { Form as FormInertia } from "@inertiajs/react";
import { useEffect } from "react";

type FormProps = {
  user?: User;
  labels: UserLabels;
  roles: Role[];
  onSuccess(): void;
};

export default function FormGeneral({ user, labels, onSuccess }: FormProps): React.JSX.Element {
  const [antdForm] = AntdForm.useForm();
  useEffect(() => {
    if (user) {
      antdForm.setFieldsValue(user);
    } else {
      antdForm.resetFields();
    }
  }, [user, antdForm]);

  const formAction = user === undefined ? route("users.store") : route("users.update", { id: user.id });
  const formMethod = user === undefined ? "POST" : "PUT";

  const attributes: (keyof Omit<User, "roles">)[] = ["login", "name", "email", "company", "department", "position", "telephone", "torm_code"];

  return (
    <FormInertia
      action={formAction}
      method={formMethod}
      onSuccess={onSuccess}
    >
      {({ errors, processing }) => (
        <AntdForm form={antdForm} layout="vertical" component="div" requiredMark={false}>
          <Space orientation="vertical" size={0} style={{ display: "flex" }}>
            {attributes.map((attribute) => (
              <Form.Item
                key={attribute}
                label={labels[attribute]}
                validateStatus={errors[attribute] ? "error" : ""}
                help={errors[attribute]}
              >
                <Input
                  placeholder={labels[attribute]}
                  name={attribute}
                  defaultValue={user ? user[attribute] : ""}
                />
              </Form.Item>
            ))}

            <Button loading={processing} type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Space>
        </AntdForm>
      )}
    </FormInertia>
  );
}
