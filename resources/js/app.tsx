// Polyfill для Iterator.prototype.join (es-toolkit / ES2018) — нужен для Edge < 90 и старых окружений
if (typeof Iterator !== "undefined" && typeof Iterator.prototype.join !== "function") {
    Iterator.prototype.join = function (separator: string): string {
        const result: unknown[] = [];
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this as Iterator<unknown>;
        for (const item of self) {
            result.push(item);
        }
        return result.join(separator);
    };
}

// Polyfill для Object.hasOwn (ES2022) — нужен для Edge < 90 и старых окружений
if (!Object.hasOwn) {
    Object.hasOwn = function (obj: unknown, prop: string | symbol): boolean {
        return Object.prototype.hasOwnProperty.call(
            obj as Record<string, unknown>,
            prop,
        );
    };
}

import "../css/app.css";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { MainLayout } from "./Layout/MainLayout";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import "./bootstrap";

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
            colorBgLayout: "#ffffff",
            fontFamily: "'Golos Text', system-ui, -apple-system, sans-serif",
          },
        }}
      >
        <App {...props} />
      </ConfigProvider>,
    );
  },
  progress: {
    color: "#228be6",
  },
});
