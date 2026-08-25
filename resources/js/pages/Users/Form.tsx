import { Button, Stack, TextInput } from "@mantine/core";
import { User, UserLabels } from "./types";
import { Form as FormInertia } from '@inertiajs/react';

type FormProps = {
  user?: User;
  labels: UserLabels;
  onSuccess(): void;
};

export default function Form({ user, labels, onSuccess }: FormProps): React.JSX.Element {
  const formAction = user === undefined ? route('users.store') : route('users.update', { id: user.id });
  const formMethod = user === undefined ? 'POST': 'PUT';

  return (<>
    <FormInertia action={formAction} method={formMethod} onSuccess={onSuccess}>
      {({ errors, processing }) => (
        <Stack gap={10}>
          <TextInput
            label={labels.login}
            placeholder={labels.login}
            name="login"
            defaultValue={user?.login}
            error={errors?.login}
          />
          <TextInput
            label={labels.name}
            placeholder={labels.name}
            name="name"
            defaultValue={user?.name}
            error={errors?.name}
          />
          <TextInput
            label={labels.email}
            placeholder={labels.email}
            name="email"
            defaultValue={user?.email}
            error={errors?.email}
          />
          <TextInput
            label={labels.company}
            placeholder={labels.company}
            name="company"
            defaultValue={user?.company}
            error={errors?.company}
          />
          <TextInput
            label={labels.department}
            placeholder={labels.department}
            name="department"
            defaultValue={user?.department}
            error={errors?.department}
          />
          <TextInput
            label={labels.position}
            placeholder={labels.position}
            name="position"
            defaultValue={user?.position}
            error={errors?.position}
          />
          <TextInput
            label={labels.telephone}
            placeholder={labels.telephone}
            name="telephone"
            defaultValue={user?.telephone}
            error={errors?.telephone}
          />

          <Button loading={processing} type="submit" mt="lg">
            Сохранить
          </Button>
        </Stack>
      )}
    </FormInertia>
  </>);
};
