/// <reference types="vite/client" />
import { route as ziggyRoute } from 'ziggy-js';

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare global {
    const route: typeof ziggyRoute;
}
