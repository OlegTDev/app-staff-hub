import { Button, Card, Checkbox, ConfigProvider, Flex, Form, Input, Layout, Space, theme, Typography } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useState } from "react";
import { router, useForm } from "@inertiajs/react";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Login(): React.JSX.Element {
  const { data, setData, post, processing, errors, reset } = useForm({
    username: '',
    password: '',
    remember: true,
  });
  const { token } = theme.useToken();
  const [ loading, setLoading ] = useState(false);
  // const onFinishHandle = (values: any) => {
  //   setLoading(true);

  //   router.post(route('login.store'), values, {
  //     onFinish: () => setLoading(false),
  //   });
  // };
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    post(route('login.store'));
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: token.colorBgLayout,
      }}
    >
      <Content>
        <Flex
          justify="center"
          align="center"
          style={{ minHeight: "100vh", padding: token.paddingLG }}
        >
          <Card
            variant="borderless"
            style={{
              width: "100%",
              maxWidth: 420,
              borderRadius: token.borderRadiusLG * 1.5,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)",
              background: token.colorBgLayout,
              padding: `${token.paddingLG * 1.5}px`,
            }}
          >
            <Flex vertical align="center">
              <div style={{ marginTop: token.marginXS }}>
                <div style={{ textAlign: "center" }}>
                  <Title level={3} style={{ margin: 0, fontWeight: 700, letterSpacing: "-0.5px" }}>
                    Вход в систему
                  </Title>
                  <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                    Войдите с помощью учетной записи
                  </Text>
                </div>
                <form onSubmit={handleSubmit} style={{ marginTop: token.marginXL }}>
                  <Space orientation="vertical" style={{ display: "flex" }}>
                    <Form.Item
                      htmlFor="username"
                      validateStatus={errors?.username ? 'error' : ''}
                      help={errors.username}
                    >
                      <Input
                        id="username"
                        size="large"
                        placeholder="Имя пользователя"
                        prefix={<UserOutlined style={{ color: token.colorTextDisabled }}  />}
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        style={{ borderRadius: token.borderRadius }}
                      />
                    </Form.Item>


                    <Form.Item
                      htmlFor="password"
                      validateStatus={errors.password ? 'error' : ''}
                      help={errors.password}
                    >
                      <Input.Password
                        id="password"
                        size="large"
                        placeholder="Пароль"
                        prefix={<LockOutlined style={{ color: token.colorTextDisabled }}  />}
                        value={data.password}
                        onChange={(e)=>setData("password", e.currentTarget.value)}
                        style={{ borderRadius: token.borderRadius }}
                      />
                    </Form.Item>

                    <Form.Item
                      htmlFor="remember"
                      validateStatus={errors.remember ? 'error' : ''}
                      help={errors.remember}
                    >
                      <Checkbox
                        id="remember"
                        value={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                      >
                        Запомнить меня
                      </Checkbox>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        icon={<LoginOutlined />}
                        style={{
                          borderRadius: token.borderRadius,
                          fontWeight: 600,
                          height: 44,
                          boxShadow: "0 4px 12px rgba(22, 119, 255, 0.15)",
                        }}
                        >
                        Войти
                      </Button>
                    </Form.Item>
                  </Space>
                </form>
              </div>
            </Flex>
          </Card>
        </Flex>
      </Content>
    </Layout>
  );
}

Login.layout = null;












// import { Head, useForm } from "@inertiajs/react";
// import { Button, Checkbox, Flex, Paper, PasswordInput, Stack, TextInput, useMantineColorScheme } from "@mantine/core";


// export default function Login(): React.JSX.Element  {
//   const { data, setData, post, processing, errors, reset } = useForm({
//     username: '',
//     password: '',
//     remember: true,
//   });

//   const handleSubmit = (e: React.SubmitEvent) => {
//     e.preventDefault();
//     post(route('login.store'), {
//       onFinish: () => reset('password'),
//     });
//   };

//   const { colorScheme } = useMantineColorScheme();

//   return (
//     <Flex mih="100vh" bg={ colorScheme === 'dark' ? 'dark' : 'gray.1' } justify="center" align="center" p="md">
//       <Head title="Авторизация" />
//       <Paper withBorder shadow="md" p={30} mt={30} radius="md" w={500}>
//         <form onSubmit={handleSubmit}>
//           <Stack>
//             <TextInput
//               label="Логин"
//               placeholder="Введите логин"
//               value={data.username}
//               onChange={(e) => setData('username', e.target.value)}
//               error={errors.username}
//             />

//             <PasswordInput
//               label="Пароль"
//               placeholder="Введите пароль"
//               value={data.password}
//               onChange={(e) => setData('password', e.target.value)}
//               error={errors.password}
//             />

//             <Checkbox
//               label="Запомнить меня"
//               checked={data.remember}
//               onChange={(e) => setData('remember', e.target.checked)}
//             />

//             <Button
//               type="submit"
//               fullWidth
//               mt="xl"
//               loading={processing}
//             >
//               Войти
//             </Button>
//           </Stack>
//         </form>
//       </Paper>
//     </Flex>
//   );
// }

// Login.layout = null;
