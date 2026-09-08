import { Button, Stack, TextInput } from "@mantine/core";
import { Torm, TormLabels } from "./types";
import { Form as FormInertia } from '@inertiajs/react';

type FormProps = {
  torm?: Torm;
  labels: TormLabels;
  route: string;
  onSuccess(): void;
  method: 'PUT'|'POST';
};

export default function Form({ torm, labels, onSuccess, route, method = 'POST' }: FormProps): React.JSX.Element {

  return <FormInertia action={route} method={method} onSuccess={onSuccess}>
    {({ errors, processing }) => (
      <Stack gap={10}>
        <TextInput
          label={labels.code}
          placeholder={labels.code}
          name="code"
          defaultValue={torm?.code}
          error={errors?.code}
        />
        <TextInput
          label={labels.name}
          placeholder={labels.name}
          name="name"
          defaultValue={torm?.name}
          error={errors?.name}
        />

        <Button loading={processing} type="submit" mt="lg">
          Сохранить
        </Button>
      </Stack>
    )}
  </FormInertia>
}
