import type { Plugin } from "vite";
import {
  parseDynaticCSS,
  type NameslessStyleOrderedChunks,
} from "@packages/dynatic-css-typescript-parser";
import { hashString, createClassName } from "@packages/dynatic-css-utils";
import { parseCSS } from "./parseCSS";
import { replaceSubstring } from "@packages/utils";
import { readFileSync } from "fs";
import { generateConfigCSS } from "./generateConfigCSS";
import type { DynaticConfiguration } from "@packages/dynatic-css";
import { buildDynatic } from "./buildDynatic";

type DynaticPluginArgs = {
  uniqueImports?: string[];
};

export const dynaticPlugin = (args?: DynaticPluginArgs): Plugin => {
  const { uniqueImports = [] } = args ?? {};
  const baseIdentifiers = ['dynatic-css.config"', "@packages/dynatic-css"];
  const identifiers = uniqueImports ? [...uniqueImports, ...baseIdentifiers] : baseIdentifiers;
  let isBuild = false;

  const inserted = new Map<string, string>();
  const pseudoClasses = new Map<string, string>();
  const mediaQueries = new Map<string, Map<string, string>>();
  let projectRoot = "";

  const isDebug = process.argv.includes("--dynatic-debug");

  let filePath: string;
  let fileText: string;
  let configCSS: string;
  let updatedConfig: DynaticConfiguration;
  let configObjectStartIndex: number;

  return {
    name: "dynatic-css",
    enforce: "pre", // <- critical to run *before* React/esbuild plugins
    apply: isDebug ? "serve" : "build",
    // config(config, { command }) {
    //   isBuild = command === "build";
    // },
    configResolved(resolvedConfig) {
      const { command } = resolvedConfig;
      isBuild = command.startsWith("build");
      projectRoot = resolvedConfig.root;

      if (isBuild || isDebug) {
        filePath = `${projectRoot}/src/dynatic-css.config.ts`;
        fileText = readFileSync(filePath, { encoding: "utf-8" });
        const generatedConfig = generateConfigCSS({ fileText });
        configCSS = generatedConfig.configCSS;
        updatedConfig = generatedConfig.updatedConfig;
        configObjectStartIndex = generatedConfig.configObjectStartIndex;
      }
    },
    // configureServer(server: ViteDevServer) {
    //   if (!isBuild) {
    //     // Dev-only server middleware logic here
    //     server.middlewares.use((req, res, next) => {
    //       // Example: log every request in dev
    //       // console.log(`[dev request]: ${req.url}`);
    //       next();
    //     });
    //   }
    // },

    async transform(code: string, id: string) {
      if (!isBuild && !isDebug) {
        return;
      }

      const identifier = identifiers.find((identifier) => code.indexOf(identifier) !== -1);

      if (!identifier) {
        return;
      }

      const {
        // dynaticStyleChunks,
        dynaticStyleOrderedChunks,
        nameslessStyleOrderedChunks,
        // uniqueImports,
        // mappedImports,
        // importVariables,
        contexts,
        // classNames,
      } = parseDynaticCSS({ input: code, identifier });

      // const parsedDynaticChunks: Record<
      //   string,
      //   Record<
      //     string,
      //     {
      //       startIndex: number;
      //       endIndex: number;
      //       newValue: string;
      //       isFullyStatic: boolean;
      //     }
      //   >
      // > = {};

      const ordered: (NameslessStyleOrderedChunks[number] & { name?: string })[] = [
        ...dynaticStyleOrderedChunks,
        ...nameslessStyleOrderedChunks,
      ].sort((chunkA, chunkB) => chunkB.endIndex - chunkA.endIndex);

      ordered.forEach((current) => {
        const { startIndex, endIndex, value, context, variables } = current;

        const start = value.indexOf("`");
        const css = value.slice(start);

        const output = parseCSS({
          css,
          context: context,
          variables: variables.map((variable) => {
            const { startIndex: variableStart, endIndex: variableEnd } = variable;

            const newStart = variableStart - startIndex - start;

            return {
              ...variable,
              startIndex: newStart,
              endIndex: variableEnd - variableStart + newStart,
            };
          }),
          contexts,
          updatedConfig,
        });

        const classNames: string[] = [];
        let dynamicRows = "";
        let currentMediaQuery: string | undefined;
        let currentPseudoClass: string | undefined;

        output.forEach((row, index) => {
          if (row.isRowStatic) {
            const { value, pseudoClass, mediaQuery } = row;

            const fullValue = createClassName({ value, pseudoClass, mediaQuery });
            const hash = hashString({ input: fullValue });
            const className = `css-${hash}`;

            if (mediaQuery) {
              if (!mediaQueries.has(mediaQuery)) {
                mediaQueries.set(mediaQuery, new Map<string, string>());
              }

              mediaQueries.get(mediaQuery)!.set(className, value);
            } else {
              if (!inserted.has(className)) {
                inserted.set(className, value);
              }
            }

            if (pseudoClass) {
              pseudoClasses.set(className, pseudoClass);
            }

            classNames.push(className);

            if (currentPseudoClass) {
              currentPseudoClass = undefined;
              dynamicRows += " }\n";
            }

            if (currentMediaQuery) {
              currentMediaQuery = undefined;
              dynamicRows += " }\n";
            }
          } else {
            const { value, pseudoClass, mediaQuery } = row;
            const mediaQueryChanged = currentMediaQuery !== mediaQuery;
            const pseudoClassChanged = currentPseudoClass !== pseudoClass;

            if (pseudoClassChanged && currentPseudoClass) {
              dynamicRows += " }\n ";
            }

            if (mediaQueryChanged && currentMediaQuery) {
              dynamicRows += " }\n ";
            }

            if (mediaQueryChanged) {
              currentMediaQuery = mediaQuery;

              if (mediaQuery) {
                dynamicRows += `${mediaQuery} {\n `;
              }
            }

            if (pseudoClassChanged) {
              currentPseudoClass = pseudoClass;

              if (pseudoClass) {
                dynamicRows += `&${pseudoClass} {\n `;
              }
            }

            dynamicRows += `${value};\n `;

            if (pseudoClass && index === output.length - 1) {
              dynamicRows += " }\n ";
            }

            if (mediaQuery && index === output.length - 1) {
              dynamicRows += " }\n ";
            }
          }
        });

        const mergedClassNames = classNames.join(" ");
        const complete: string[] = [];
        const initial = value.slice(0, start);
        const hasDynamicRows = dynamicRows.length > 0;

        if (hasDynamicRows) {
          complete.push(`${initial}\`\n${dynamicRows}\``);
        }

        if (mergedClassNames.length > 0) {
          if (hasDynamicRows) {
            complete.push(`+ " ${mergedClassNames}"`);
          } else {
            complete.push(mergedClassNames);
          }
        }

        const fullResult = complete.join(" ");

        // if (!parsedDynaticChunks[context]) {
        //   parsedDynaticChunks[context] = {};
        // }

        const isFullyStatic = dynamicRows.length === 0;

        // if (name) {
        //   parsedDynaticChunks[context][name] = {
        //     startIndex,
        //     endIndex,
        //     newValue: fullResult,
        //     isFullyStatic,
        //   };
        // }

        code = replaceSubstring({
          str: code,
          from: startIndex,
          to: endIndex,
          newStr: isFullyStatic ? `"${fullResult}"` : fullResult,
        });
      });

      await buildDynatic({
        projectRoot,
        inserted,
        pseudoClasses,
        mediaQueries,
        configCSS,
        filePath,
        fileText,
        updatedConfig,
        configObjectStartIndex,
      });

      return code;
    },
    generateBundle: async () => {
      await buildDynatic({
        projectRoot,
        inserted,
        pseudoClasses,
        mediaQueries,
        configCSS,
        filePath,
        fileText,
        updatedConfig,
        configObjectStartIndex,
      });
    },
  };
};
