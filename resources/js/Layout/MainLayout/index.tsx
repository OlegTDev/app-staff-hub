import { Flex, Layout, theme } from "antd";
import { Sidebar } from "../Sidebar";
import { ReactNode } from "react";
import { Header } from "../Header";
import { FlashNotifications } from "../FlashNotifications";

interface Props {
  children: ReactNode;
}

const { Content } = Layout;

export function MainLayout({ children }: Props) {
  const { token } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Flex
        vertical
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: "100vh",
        }}
      >
        <Header />
        <Content
          className="main-layout-main"
          style={{
            flex: 1,
            padding: token.paddingLG,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <FlashNotifications />
          {children}
        </Content>
      </Flex>
    </Layout>
  );
}
