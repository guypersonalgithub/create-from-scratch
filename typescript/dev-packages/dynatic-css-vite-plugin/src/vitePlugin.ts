import type { Plugin } from "vite";
import { generateConfigCSS } from "./generateConfigCSS";
import type { DynaticConfiguration } from "@packages/dynatic-css";
import { buildDynatic } from "./buildDynatic";
import { mapAliases } from "./mapAliases";
import { recursivelyIterateFiles, type FullPathData } from "@packages/recursive-import-iteration";
import { parseDynatic } from "./parseDynatic";

type DynaticPluginArgs = {
  uniqueImports?: string[];
};

export const dynaticPlugin = (args?: DynaticPluginArgs): Plugin => {
  const { uniqueImports = [] } = args ?? {};
  const configPath = "dynatic-css.config";
  const baseIdentifiers = [`${configPath}`, "@packages/dynatic-css"];
  const identifiers = uniqueImports ? [...uniqueImports, ...baseIdentifiers] : baseIdentifiers;
  let isBuild = false;

  const inserted = new Map<string, string>();
  const pseudoClasses = new Map<string, string>();
  const mediaQueries = new Map<string, Map<string, string>>();
  const fullParsedPaths = new Map<string, FullPathData>();
  let projectRoot = "";

  const isDebug = process.argv.includes("--dynatic-debug");
  let mappedAliases: Record<string, string>;
  let cssFilePath: string | undefined;
  let cssFile: string | undefined;

  return {
    name: "dynatic-css",
    enforce: "pre", // <- critical to run *before* React/esbuild plugins
    apply: isDebug ? "serve" : "build",
    // config(config, { command }) {
    //   isBuild = command === "build";
    // },
    configResolved(resolvedConfig) {
      const { command, resolve } = resolvedConfig;
      mappedAliases = mapAliases({ alias: resolve.alias });
      isBuild = command.startsWith("build");
      projectRoot = resolvedConfig.root;

      if (isBuild || isDebug) {
        const fullPaths = recursivelyIterateFiles({
          absolutePath: `${projectRoot}/src`,
          startingFile: "main.tsx",
          mappedAliases,
        });

        const configFilePath = `${projectRoot}/src/${configPath}.ts`;
        const config = fullPaths.get(configFilePath);
        let fileText: string | undefined;
        let configCSS: string | undefined;
        let updatedConfig: DynaticConfiguration | undefined;
        let configObjectStartIndex: number | undefined;

        if (config) {
          const { input } = config;
          const generatedConfig = generateConfigCSS({ fileText: input });
          configCSS = generatedConfig.configCSS;
          updatedConfig = generatedConfig.updatedConfig;
          configObjectStartIndex = generatedConfig.configObjectStartIndex;
          fileText = input;
        }

        for (const [path, value] of fullPaths) {
          const { imports, exports, currentIndex, input } = value;

          let identifier: string | undefined;

          for (const imp in imports) {
            identifier = identifiers.find((identifier) => imp.endsWith(identifier));
            if (identifier) {
              break;
            }
          }

          if (!identifier) {
            continue;
          }

          const updated = parseDynatic({
            input,
            from: currentIndex,
            identifier,
            updatedConfig,
            inserted,
            pseudoClasses,
            mediaQueries,
          });

          if (updated !== input) {
            fullParsedPaths.set(path, { imports, exports, currentIndex, input: updated });
          }
        }

        let mainFile: string | undefined;
        const mainFilePath = `${projectRoot}/src/main.tsx`;
        const mainFileData = fullPaths.get(mainFilePath);
        if (mainFileData) {
          mainFile = mainFileData.input;
        }

        const build = buildDynatic({
          projectRoot,
          inserted,
          pseudoClasses,
          mediaQueries,
          configCSS,
          fileText,
          updatedConfig,
          configObjectStartIndex,
          mainFile,
        });

        if (build) {
          const { mainFile, cssPath, updatedCSSFile, updatedConfigFile } = build;
          if (mainFileData && mainFile) {
            const { imports, exports, currentIndex } = mainFileData;

            fullParsedPaths.set(mainFilePath, { imports, exports, currentIndex, input: mainFile });
          }

          if (config && updatedConfigFile) {
            const { imports, exports, currentIndex } = config;

            fullParsedPaths.set(updatedConfigFile, {
              imports,
              exports,
              currentIndex,
              input: updatedConfigFile,
            });
          }

          cssFilePath = cssPath;
          cssFile = updatedCSSFile;
        }
      }
    },
    resolveId(id) {
      if (id === cssFilePath) {
        return id;
      }
    },
    load(id) {
      if (id === cssFilePath) {
        return cssFile;
      }
    },
    // configureServer(server: ViteDev  Server) {
    //   if (!isBuild) {
    //     // Dev-only server middleware logic here
    //     server.middlewares.use((req, res, next) => {
    //       // Example: log every request in dev
    //       // console.log(`[dev request]: ${req.url}`);
    //       next();
    //     });
    //   }
    // },
    buildStart: () => {},
    transform(code: string, id: string) {
      if (!isBuild && !isDebug) {
        return;
      }

      const data = fullParsedPaths.get(id);

      return data?.input ?? code;
    },
  };
};
