import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "packages/table": path.resolve("__dirname", "../../packages/table/src/index.ts"),
      "packages/tooltip": path.resolve("__dirname", "../../packages/tooltip/src/index.ts"),
      "packages/animation-container": path.resolve(
        "__dirname",
        "../../packages/animation-container/src/index.ts",
      ),
      "packages/utils": path.resolve("__dirname", "../../packages/utils/src/index.ts"),
      "packages/router": path.resolve("__dirname", "../../packages/router/src/index.ts"),
      "packages/randomizer": path.resolve("__dirname", "../../packages/randomizer/src/index.ts"),
    },
  },
});
