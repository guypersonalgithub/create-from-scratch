import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@packages/router": path.resolve(__dirname, "../../packages/router/src/index.ts"),
      "@packages/utils": path.resolve(__dirname, "../../packages/utils/src/index.ts"),
      "@packages/url": path.resolve(__dirname, "../../packages/url/src/index.ts"),
      "@packages/environment": path.resolve(__dirname, "../../packages/environment/src/index.ts"),
      "@packages/hooks": path.resolve(__dirname, "../../packages/hooks/src/index.ts"),
      "@packages/array-utils": path.resolve(__dirname, "../../packages/array-utils/src/index.ts"),
      "@packages/object-utils": path.resolve(__dirname, "../../packages/object-utils/src/index.ts"),
      "@packages/syntax-highlighter": path.resolve(
        __dirname,
        "../../packages/syntax-highlighter/src/index.ts",
      ),
      "@packages/ui-theme": path.resolve(__dirname, "../../packages/ui-theme/src/index.ts"),
      "@packages/icons": path.resolve(__dirname, "../../packages/icons/src/index.ts"),
      "@packages/button": path.resolve(__dirname, "../../packages/button/src/index.ts"),
      "@packages/pseudo-terminal-visuals": path.resolve(
        __dirname,
        "../../packages/pseudo-terminal-visuals/src/index.ts",
      ),
      "@packages/copy-to-clipboard": path.resolve(
        __dirname,
        "../../packages/copy-to-clipboard/src/index.ts",
      ),
      "@packages/tooltip": path.resolve(__dirname, "../../packages/tooltip/src/index.ts"),
      "@packages/animation-container": path.resolve(
        __dirname,
        "../../packages/animation-container/src/index.ts",
      ),
      "@packages/is-dev": path.resolve(__dirname, "../../packages/is-dev/src/index.ts"),
      "@packages/randomizer": path.resolve(__dirname, "../../packages/randomizer/src/index.ts"),
      "@packages/edge-intersection": path.resolve(
        __dirname,
        "../../packages/edge-intersection/src/index.ts",
      ),
      "@dev-packages/yaml": path.resolve(__dirname, "../../dev-packages/yaml/src/index.ts"),
      "@packages/alert": path.resolve(__dirname, "../../packages/alert/src/index.ts"),
      "@packages/card": path.resolve(__dirname, "../../packages/card/src/index.ts"),
      "@packages/command-box": path.resolve(__dirname, "../../packages/command-box/src/index.ts"),
      "@packages/css-utils": path.resolve(__dirname, "../../packages/css-utils/src/index.ts"),
    },
  },
});
