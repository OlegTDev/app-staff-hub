import "../css/app.css";
import "@mantine/core/styles.css";
import 'mantine-datatable/styles.layer.css';

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { MantineProvider, createTheme } from "@mantine/core";
import MainLayout from "./layouts/MainLayout";

// Здесь вы можете настроить глобальную тему (шрифты, цвета, скругления)
const theme = createTheme({
  primaryColor: "blue",
  defaultRadius: "md",
  fontFamily: "'Golos Text', system-ui, -apple-system, sans-serif",
  headings: {
    //fontFamily: "'Golos Text', system-ui, sans-serif",
    fontWeight: "500",
  },
});

createInertiaApp({
  title: (title) => `${title} - Mantine App`,
  resolve: async (name) => {
    const pages = import.meta.glob("./pages/**/*.tsx");
    const page = (await resolvePageComponent(
      `./pages/${name}.tsx`,
      pages as any,
    )) as any;

    page.default.layout =
      page.default.layout || ((page: any) => <MainLayout>{page}</MainLayout>);
    return page;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <App {...props} />
      </MantineProvider>,
    );
  },
  progress: {
    color: "#228be6",
  },
});
