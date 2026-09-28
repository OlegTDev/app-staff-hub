import { useSettingStore } from "@/stores/settings";
import { Button, Flex, Layout, theme } from "antd";
import { PanelLeft } from "lucide-react";
import { LeftMenu } from "../LeftMenu";
import "./index.css";

const { Sider } = Layout;

export function Sidebar() {
  const collapsed = useSettingStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useSettingStore((s) => s.setSidebarCollapsed);
  const toggleSidebarCollapsed = useSettingStore((s) => s.toggleSidebar);
  const { token } = theme.useToken();

  const sidebarContent = (isCollapsed: boolean, omitBrandToggle = false) => (
    <Flex
      vertical
      style={{
        height: "100%",
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <Flex
        vertical
        justify="center"
        align={isCollapsed ? 'center' : 'stretch'}
        style={{
          paddingBlock: token.paddingSM,
          paddingInline: isCollapsed ? token.paddingXXS : token.paddingSM,
          minHeight: 64,
          flexShrink: 0,
          width: "100%",
          minWidth: 0,
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <Flex
          align="center"
          gap={token.marginSM}
          style={{
            width: "100%",
            minWidth: 0,
            maxWidth: "100%",
            boxSizing: "border-box",
            paddingInline: isCollapsed ? 0 : token.paddingXS,
            minHeight: 40,
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          {isCollapsed ? (
            <div className="sidebar-collapsed-brand">
              <div className="sidebar-collapsed-brand__logoLayer">
                <img
                  src="https://img.icons8.ru/color/1200/ios-photos.jpg"
                  alt="logo"
                  width={24}
                  height={24}
                  style={{
                    borderRadius: token.borderRadius,
                    display: "block",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div className="sidebar-collapsed-brand__toggleLayer">
                <Button
                  type="text"
                  size="small"
                  onClick={toggleSidebarCollapsed}
                  className="sidebar-collapsed-brand__toggle"
                  icon={<PanelLeft size={token.fontSizeLG} />}
                  aria-label="Toggle sidebar"
                />
              </div>
            </div>
          ) : (
            <Flex
              align="center"
              gap={token.marginSM}
              style={{
                minWidth: 0,
                flex: 1,
                overflow: "hidden",
              }}
            >
              <img
                src="https://img.icons8.ru/color/1200/ios-photos.jpg"
                alt="logo"
                width={24}
                height={24}
                style={{
                  borderRadius: token.borderRadius,
                  display: "block",
                  objectFit: "contain",
                }}
              />
              <div
                style={{
                  minWidth: 0,
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  fontSize: token.fontSizeLG,
                  textTransform: "uppercase",
                }}
              >
                My Application Name
              </div>
              {!omitBrandToggle ? (
                <Button
                  type="text"
                  size="small"
                  onClick={toggleSidebarCollapsed}
                  icon={<PanelLeft size={token.fontSizeLG} />}
                  aria-label="Toggle sidebar"
                  style={{ flexShrink: 0 }}
                />
              ) : null}

            </Flex>
          )}
        </Flex>
      </Flex>
      <LeftMenu />
    </Flex>
  );


  return (
    <Sider
      key={collapsed ? "collapsed" : "expanded"}
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={240}
      collapsedWidth={64}
      breakpoint="lg"
      onBreakpoint={(broken) => {
        if (broken) {
          setSidebarCollapsed(false);
        }
      }}
      style={{
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgLayout,
        alignSelf: "stretch",
        minHeight: "100vh",
        overflow: "visible",
      }}
    >
      {sidebarContent(collapsed)}
    </Sider>
  );
}
