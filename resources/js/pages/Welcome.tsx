import { Text, Button, Card, Title } from '@mantine/core';

export default function Welcome() {
  return (
    <>
      <Title order={1} mb="lg">Добро пожаловать в систему!</Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 400 }}>
        <Text fw={700} size="lg">Mantine + Inertia работает!</Text>
        <Text size="sm" c="dimmed" mt="xs" mb="md">
          Интерфейс успешно скомпилирован. Вы можете использовать любые компоненты из экосистемы Mantine.
        </Text>
        <Button color="blue" fullWidth>
          Посмотреть картриджи
        </Button>
      </Card>
    </>
  );
}
