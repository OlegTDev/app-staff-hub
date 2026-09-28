import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { Role } from "../types";
import { Button, Checkbox, Space, Form as AntdForm } from "antd";

type FormProps = {
  idUser: number;
  roles: Role[];
  userRoles: Role[];
  onSuccess(): void;
};

export default function FormRoles({ idUser, roles, userRoles, onSuccess }: FormProps): React.JSX.Element {
  const [antdForm] = AntdForm.useForm();

  const { setData, put, processing, isDirty } = useForm({
    roles: userRoles.map((role) => role.id),
  });

  useEffect(() => {
    const currentRoleIds = userRoles.map((role) => role.id);
    antdForm.setFieldsValue({ roles: currentRoleIds });
    setData('roles', currentRoleIds);
  }, [userRoles, antdForm]);

  const handleSubmit = () => {
    const url = route("users.roles.update", { user: idUser });
    put(url, { onSuccess });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <AntdForm
        form={antdForm}
        layout="vertical"
        component="div"
      >
        <Space orientation="vertical" size={24} style={{ width: "100%" }}>
          <AntdForm.Item name="roles" style={{ margin: 0 }}>
            <Checkbox.Group
              style={{ width: "100%" }}
              onChange={(checkedValues) => setData('roles', checkedValues)}
            >
              <Space orientation="vertical" style={{ width: "100%" }}>
                {roles.map((role: Role) => (
                  <Checkbox key={role.id} value={role.id}>
                    {role.description ? `${role.description} (${role.name})` : role.name}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </AntdForm.Item>
          <Button loading={processing} type="primary" htmlType="submit" block disabled={!isDirty}>
            Сохранить изменения
          </Button>
        </Space>
      </AntdForm>
    </form>
  );
}
