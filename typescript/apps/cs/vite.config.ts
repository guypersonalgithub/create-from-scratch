import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { dynaticPlugin } from "@packages/dynatic-css-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dynaticPlugin()],
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
      "@packages/calculate-relative-position": path.resolve(
        __dirname,
        "../../packages/calculate-relative-position/src/index.ts",
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
      "@packages/scrollspy-anchors": path.resolve(
        __dirname,
        "../../packages/scrollspy-anchors/src/index.ts",
      ),
      "@packages/breadcrumbs": path.resolve(__dirname, "../../packages/breadcrumbs/src/index.ts"),
      "@packages/binary": path.resolve(__dirname, "../../packages/binary/src/index.ts"),
      "@packages/dynatic-css": path.resolve(__dirname, "../../packages/dynatic-css/src/index.ts"),
      "@packages/dynatic-css-utils": path.resolve(
        __dirname,
        "../../packages/dynatic-css-utils/src/index.ts",
      ),
      "@dev-packages/dynatic-css-vite-plugin": path.resolve(
        __dirname,
        "../../dev-packages/dynatic-css-vite-plugin/src/index.ts",
      ),
      "@dev-packages/dynatic-css-typescript-parser": path.resolve(
        __dirname,
        "../../dev-packages/dynatic-css-typescript-parser/src/index.ts",
      ),
      "@dev-packages/typescript-file-manipulation": path.resolve(
        __dirname,
        "../../dev-packages/typescript-file-manipulation/src/index.ts",
      ),
      "@dev-packages/prettier": path.resolve(__dirname, "../../dev-packages/prettier/src/index.ts"),
      "@dev-packages/paths": path.resolve(__dirname, "../../dev-packages/paths/src/index.ts"),
    },
  },
});
