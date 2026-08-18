import { Head, useForm } from "@inertiajs/react";
import { Button, Checkbox, Flex, Paper, PasswordInput, Stack, TextInput, useMantineColorScheme } from "@mantine/core";


export default function Login(): React.JSX.Element  {
  const { data, setData, post, processing, errors, reset } = useForm({
    username: '',
    password: '',
    remember: true,
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    post(route('login.store'), {
      onFinish: () => reset('password'),
    });
  };

  const { colorScheme } = useMantineColorScheme();

  return (
    <Flex mih="100vh" bg={ colorScheme === 'dark' ? 'dark' : 'gray.1' } justify="center" align="center" p="md">
      <Head title="Авторизация" />
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" w={500}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Логин"
              placeholder="Введите логин"
              value={data.username}
              onChange={(e) => setData('username', e.target.value)}
              error={errors.username}
            />

            <PasswordInput
              label="Пароль"
              placeholder="Введите пароль"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              error={errors.password}
            />

            <Checkbox
              label="Запомнить меня"
              checked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
            />

            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={processing}
            >
              Войти
            </Button>
          </Stack>
        </form>
      </Paper>
    </Flex>
  );
}

Login.layout = null;
