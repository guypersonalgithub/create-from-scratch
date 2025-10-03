import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "@packages/micro-frontends": path.resolve(
        __dirname,
        "../../packages/micro-frontends/src/index.ts",
      ),
      "@packages/table": path.resolve(__dirname, "../../packages/table/src/index.ts"),
      "@packages/pagination": path.resolve(__dirname, "../../packages/pagination/src/index.ts"),
      "@packages/button": path.resolve(__dirname, "../../packages/button/src/index.ts"),
      "@packages/utils": path.resolve(__dirname, "../../packages/utils/src/index.ts"),
      "@packages/tooltip": path.resolve(__dirname, "../../packages/tooltip/src/index.ts"),
      "@packages/animation-container": path.resolve(
        __dirname,
        "../../packages/animation-container/src/index.ts",
      ),
      "@packages/is-dev": path.resolve(__dirname, "../../packages/is-dev/src/index.ts"),
      "@packages/array-utils": path.resolve(__dirname, "../../packages/array-utils/src/index.ts"),
      "@packages/object-utils": path.resolve(__dirname, "../../packages/object-utils/src/index.ts"),
      "@packages/parse-typescript": path.resolve(
        __dirname,
        "../../packages/parse-typescript/src/index.ts",
      ),
      "@packages/randomizer": path.resolve(__dirname, "../../packages/randomizer/src/index.ts"),
      "@packages/edge-intersection": path.resolve(
        __dirname,
        "../../packages/edge-intersection/src/index.ts",
      ),
      "@packages/element-utils": path.resolve(
        __dirname,
        "../../packages/element-utils/src/index.ts",
      ),
      "@packages/calculate-relative-position": path.resolve(
        __dirname,
        "../../packages/calculate-relative-position/src/index.ts",
      ),
      "@packages/router": path.resolve(__dirname, "../../packages/router/src/index.ts"),
      "@packages/url": path.resolve(__dirname, "../../packages/url/src/index.ts"),
      "@packages/environment": path.resolve(__dirname, "../../packages/environment/src/index.ts"),
      "@packages/hooks": path.resolve(__dirname, "../../packages/hooks/src/index.ts"),
      "@packages/request": path.resolve(__dirname, "../../packages/request/src/index.ts"),
      "@packages/collapsible": path.resolve(__dirname, "../../packages/collapsible/src/index.ts"),
      "@packages/copy-to-clipboard": path.resolve(
        __dirname,
        "../../packages/copy-to-clipboard/src/index.ts",
      ),
      "@packages/icons": path.resolve(__dirname, "../../packages/icons/src/index.ts"),
      "@packages/mathml": path.resolve(__dirname, "../../packages/mathml/src/index.ts"),
      "@packages/math-parser": path.resolve(__dirname, "../../packages/math-parser/src/index.ts"),
      "@packages/canvas-math-graph": path.resolve(
        __dirname,
        "../../packages/canvas-math-graph/src/index.ts",
      ),
      "@packages/cypress": path.resolve(__dirname, "../../packages/cypress/src/index.ts"),
      "@packages/get-fps": path.resolve(__dirname, "../../packages/get-fps/src/index.ts"),
    },
  },
});

// build: {
//   sourcemap: true,
// },
