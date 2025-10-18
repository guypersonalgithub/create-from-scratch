import type { Plugin } from "vite";
import { recursivelyIterateFiles } from "@packages/recursive-import-iteration";
import { mapAliases } from "./mapAliases";
import { writeFileSync } from "fs";

export const recursiveImportIterationTestPlugin = (): Plugin => {
  const iteratedPaths = new Set<string>();
  let projectRoot = "";
  let mappedAliases: Record<string, string>;

  return {
    name: "recursive-import-iteration-vite-test",
    enforce: "pre",
    configResolved(resolvedConfig) {
      const { resolve } = resolvedConfig;
      mappedAliases = mapAliases({ alias: resolve.alias });
      projectRoot = resolvedConfig.root;
    },
    buildStart: () => {
      const fullPaths = recursivelyIterateFiles({
        absolutePath: `${projectRoot}/src`,
        startingFile: "main.tsx",
        mappedAliases,
      });

      const paths: string[] = [];

      for (const [key] of fullPaths) {
        paths.push(key.replace("\\", "/"));
      }

      writeFileSync("./iterated.ts", JSON.stringify({ paths }, null, 2));
    },
    transform(_: string, id: string) {
      iteratedPaths.add(id);

      writeFileSync("./viteIterated.ts", JSON.stringify({ paths: [...iteratedPaths] }, null, 2));
    },
  };
};
