import { Button, Card, Checkbox, Flex, Form, Input, Layout, Space, theme, Typography } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useForm } from "@inertiajs/react";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Login(): React.JSX.Element {
  const { data, setData, post, processing, errors } = useForm({
    username: '',
    password: '',
    remember: true,
  });
  const { token } = theme.useToken();
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
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                      >
                        Запомнить меня
                      </Checkbox>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={processing}
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
