import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "@packages/animation-container": path.resolve(
        __dirname,
        "../../packages/animation-container/src/index.ts",
      ),
      "@packages/utils": path.resolve(__dirname, "../../packages/utils/src/index.ts"),
      "@packages/is-dev": path.resolve(__dirname, "../../packages/is-dev/src/index.ts"),
      "@packages/array-utils": path.resolve(__dirname, "../../packages/array-utils/src/index.ts"),
      "@packages/object-utils": path.resolve(__dirname, "../../packages/object-utils/src/index.ts"),
      "@packages/parse-typescript": path.resolve(
        __dirname,
        "../../packages/parse-typescript/src/index.ts",
      ),
      "@packages/string-utils": path.resolve(__dirname, "../../packages/string-utils/src/index.ts"),
      "@packages/regex": path.resolve(__dirname, "../../packages/regex/src/index.ts"),
      "@packages/button": path.resolve(__dirname, "../../packages/button/src/index.ts"),
      "@packages/checkbox": path.resolve(__dirname, "../../packages/checkbox/src/index.ts"),
      "@packages/date": path.resolve(__dirname, "../../packages/date/src/index.ts"),
      "@packages/locale": path.resolve(__dirname, "../../packages/locale/src/index.ts"),
      "@packages/fetch-management": path.resolve(
        __dirname,
        "../../packages/fetch-management/src/index.ts",
      ),
      "@packages/design-patterns": path.resolve(
        __dirname,
        "../../packages/design-patterns/src/index.ts",
      ),
      "@packages/randomizer": path.resolve(__dirname, "../../packages/randomizer/src/index.ts"),
      "@packages/request": path.resolve(__dirname, "../../packages/request/src/index.ts"),
      "@packages/loading": path.resolve(__dirname, "../../packages/loading/src/index.ts"),
      "@packages/modal": path.resolve(__dirname, "../../packages/modal/src/index.ts"),
      "@packages/router": path.resolve(__dirname, "../../packages/router/src/index.ts"),
      "@packages/url": path.resolve(__dirname, "../../packages/url/src/index.ts"),
      "@packages/environment": path.resolve(__dirname, "../../packages/environment/src/index.ts"),
      "@packages/hooks": path.resolve(__dirname, "../../packages/hooks/src/index.ts"),
      "@packages/table": path.resolve(__dirname, "../../packages/table/src/index.ts"),
      "@packages/pagination": path.resolve(__dirname, "../../packages/pagination/src/index.ts"),
      "@packages/tabs": path.resolve(__dirname, "../../packages/tabs/src/index.ts"),
      "@packages/toast": path.resolve(__dirname, "../../packages/toast/src/index.ts"),
      "@packages/tooltip": path.resolve(__dirname, "../../packages/tooltip/src/index.ts"),
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
      "@packages/trigger-popper": path.resolve(
        __dirname,
        "../../packages/trigger-popper/src/index.ts",
      ),
      "@packages/typeahead": path.resolve(__dirname, "../../packages/typeahead/src/index.ts"),
      "@packages/input": path.resolve(__dirname, "../../packages/input/src/index.ts"),
      "@packages/virtual-list": path.resolve(__dirname, "../../packages/virtual-list/src/index.ts"),
      "@packages/auto-complete-input": path.resolve(
        __dirname,
        "../../packages/auto-complete-input/src/index.ts",
      ),
      "@packages/icons": path.resolve(__dirname, "../../packages/icons/src/index.ts"),
      "@packages/alter-package-versions-types": path.resolve(
        __dirname,
        "../../dev-packages/alter-package-versions-types/src/index.ts",
      ),
      "@packages/package-json": path.resolve(
        __dirname,
        "../../dev-packages/package-json/src/index.ts",
      ),
      "@packages/files": path.resolve(__dirname, "../../dev-packages/files/src/index.ts"),
      "@packages/detect-repository-dependencies-types": path.resolve(
        __dirname,
        "../../dev-packages/detect-repository-dependencies-types/src/index.ts",
      ),
      "@packages/package-manager-shared-types": path.resolve(
        __dirname,
        "../../dev-packages/package-manager-shared-types/src/index.ts",
      ),
    },
  },
});
