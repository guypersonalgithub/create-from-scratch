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
      "packages/is-dev": path.resolve("__dirname", "../../packages/is-dev/src/index.ts"),
      "packages/modal": path.resolve("__dirname", "../../packages/modal/src/index.ts"),
      "packages/toast": path.resolve("__dirname", "../../packages/toast/src/index.ts"),
      "packages/loading": path.resolve("__dirname", "../../packages/loading/src/index.ts"),
      "packages/pagination": path.resolve("__dirname", "../../packages/pagination/src/index.ts"),
      "dev-packages/detect-repository-dependencies-types": path.resolve(
        "__dirname",
        "../../packages/detect-repository-dependencies-types/src/index.ts",
      ),
      "packages/request": path.resolve("__dirname", "../../packages/request/src/index.ts"),
      "dev-packages/package-manager-shared-types": path.resolve(
        "__dirname",
        "../../packages/package-manager-shared-types/src/index.ts",
      ),
      "packages/date": path.resolve("__dirname", "../../packages/date/src/index.ts"),
      "packages/tabs": path.resolve("__dirname", "../../packages/tabs/src/index.ts"),
      "packages/url": path.resolve("__dirname", "../../packages/url/src/index.ts"),
      "packages/environment": path.resolve("__dirname", "../../packages/environment/src/index.ts"),
    },
  },
});
