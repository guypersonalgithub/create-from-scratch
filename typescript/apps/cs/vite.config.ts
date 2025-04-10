import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@packages/icons": path.resolve(__dirname, "../../packages/icons/src/index.ts"),
      "@packages/mathml": path.resolve(__dirname, "../../packages/mathml/src/index.ts"),
      "@packages/math-parser": path.resolve(__dirname, "../../packages/math-parser/src/index.ts"),
      "@packages/utils": path.resolve(__dirname, "../../packages/utils/src/index.ts"),
      "@packages/router": path.resolve(__dirname, "../../packages/router/src/index.ts"),
      "@packages/url": path.resolve(__dirname, "../../packages/url/src/index.ts"),
      "@packages/environment": path.resolve(__dirname, "../../packages/environment/src/index.ts"),
      "@packages/hooks": path.resolve(__dirname, "../../packages/hooks/src/index.ts"),
      "@packages/array-utils": path.resolve(__dirname, "../../packages/array-utils/src/index.ts"),
      "@packages/object-utils": path.resolve(__dirname, "../../packages/object-utils/src/index.ts"),
      "@packages/parse-typescript": path.resolve(
        __dirname,
        "../../packages/parse-typescript/src/index.ts",
      ),
      "@packages/sidebar": path.resolve(__dirname, "../../packages/sidebar/src/index.ts"),
      "@packages/animation-container": path.resolve(
        __dirname,
        "../../packages/animation-container/src/index.ts",
      ),
      "@packages/is-dev": path.resolve(__dirname, "../../packages/is-dev/src/index.ts"),
      "@packages/button": path.resolve(__dirname, "../../packages/button/src/index.ts"),
      "@packages/tooltip": path.resolve(__dirname, "../../packages/tooltip/src/index.ts"),
      "@packages/randomizer": path.resolve(__dirname, "../../packages/randomizer/src/index.ts"),
      "@packages/edge-intersection": path.resolve(
        __dirname,
        "../../packages/edge-intersection/src/index.ts",
      ),
      "@packages/collapsible": path.resolve(__dirname, "../../packages/collapsible/src/index.ts"),
      "@packages/auto-complete-input": path.resolve(
        __dirname,
        "../../packages/auto-complete-input/src/index.ts",
      ),
      "@packages/typeahead": path.resolve(__dirname, "../../packages/typeahead/src/index.ts"),
      "@packages/input": path.resolve(__dirname, "../../packages/input/src/index.ts"),
      "@packages/loading": path.resolve(__dirname, "../../packages/loading/src/index.ts"),
      "@packages/virtual-list": path.resolve(__dirname, "../../packages/virtual-list/src/index.ts"),
      "@packages/table": path.resolve(__dirname, "../../packages/table/src/index.ts"),
      "@packages/pagination": path.resolve(__dirname, "../../packages/pagination/src/index.ts"),
      "@packages/copy-to-clipboard": path.resolve(
        __dirname,
        "../../packages/copy-to-clipboard/src/index.ts",
      ),
      "@packages/calculations-table": path.resolve(
        __dirname,
        "../../packages/calculations-table/src/index.ts",
      ),
      "@packages/title": path.resolve(__dirname, "../../packages/title/src/index.ts"),
      "@packages/syntax-highlighter": path.resolve(
        __dirname,
        "../../packages/syntax-highlighter/src/index.ts",
      ),
      "@packages/parse-yaml": path.resolve(__dirname, "../../packages/parse-yaml/src/index.ts"),
      "@packages/ui-theme": path.resolve(__dirname, "../../packages/ui-theme/src/index.ts"),
      "@packages/css-utils": path.resolve(__dirname, "../../packages/css-utils/src/index.ts"),
      "@packages/radio-button": path.resolve(__dirname, "../../packages/radio-button/src/index.ts"),
      "@dev-packages/route-mapper": path.resolve(
        __dirname,
        "../../dev-packages/route-mapper/src/index.ts",
      ),
    },
  },
});
