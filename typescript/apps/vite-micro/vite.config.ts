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
    port: 3006,
  },
  resolve: {
    alias: {
      "packages/micro-frontends": path.resolve(
        "__dirname",
        "../../packages/micro-frontends/src/index.ts",
      ),
    },
  },
});
