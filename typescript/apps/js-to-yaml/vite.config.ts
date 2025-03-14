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
    },
  },
});
