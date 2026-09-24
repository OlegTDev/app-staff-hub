import "../css/app.css";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { MainLayout } from "./Layout/MainLayout";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";


createInertiaApp({
  title: (title) => title,
  resolve: async (name) => {
    const pages = import.meta.glob("./pages/**/*.tsx");
    const page = (await resolvePageComponent(
      `./pages/${name}.tsx`,
      pages as any,
    )) as any;

    if (page.default?.layout === null) {
      return page;
    }

    page.default.layout =
      page.default.layout || ((page: any) => <MainLayout>{page}</MainLayout>);
    return page;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <ConfigProvider
        locale={ruRU}
        theme={{
          token: {
            colorBgLayout: '#ffffff',
            fontFamily: "'Golos Text', system-ui, -apple-system, sans-serif",
          },
        }}
      >
        <App {...props} />
      </ConfigProvider>
    );
  },
  progress: {
    color: "#228be6",
  },
});
