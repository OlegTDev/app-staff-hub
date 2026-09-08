import { Button, Card, Checkbox, Stack } from "@mantine/core";
import { Form as FormInertia } from '@inertiajs/react';
import { useState } from "react";
import { Role } from "../types";

type FormProps = {
  idUser: number;
  roles: Role[];
  userRoles: Role[];
  onSuccess(): void;
};

export default function FormRoles({ idUser, roles, userRoles, onSuccess }: FormProps): React.JSX.Element {
  const url = route('users.roles.update', { user: idUser });
  const [selectedRoles, setSelectedRoles] = useState<string[]>(Object.values(userRoles).map((role) => role.name));

  const toggleRoles = (roleName: string) => {
    setSelectedRoles((prevValue) =>
      prevValue.includes(roleName) ? prevValue.filter(r => r !== roleName) : [...prevValue, roleName]
    );
  };

  return (<>
    <FormInertia action={url} method="PUT" onSuccess={onSuccess}>
      {({ errors, processing }) => (
        <>
          {console.log(errors)}
          <Card withBorder>
            <Stack gap={10} pt={10}>
              {roles.map((role: Role) => (
                  <Checkbox
                    key={role.id}
                    name="roles[]"
                    label={role.description ? `${role.description} (${role.name})` : role.name}
                    checked={selectedRoles.includes(role.name)}
                    defaultValue={role.id}
                    onChange={() => toggleRoles(role.name)}
                    error={errors?.roles}
                  />
                ))}
              </Stack>
          </Card>

          <Button loading={processing} type="submit" mt="lg">
            Сохранить
          </Button>
        </>
      )}
    </FormInertia>
  </>);
};
