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
      "packages/test": path.resolve("__dirname", "../../packages/test/src/index.ts"),
      "packages/test-dependency": path.resolve(
        "__dirname",
        "../../packages/test-dependency/src/index.ts",
      ),
      "packages/shared-types": path.resolve(
        "__dirname",
        "../../packages/shared-types/src/index.ts",
      ),
      "packages/micro-frontends": path.resolve(
        "__dirname",
        "../../packages/micro-frontends/src/index.ts",
      ),
      "packages/get-fps": path.resolve("__dirname", "../../packages/get-fps/src/index.ts"),
      "packages/cypress": path.resolve("__dirname", "../../packages/cypress/src/index.ts"),
    },
  },
});
