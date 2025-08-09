import type { Plugin } from "vite";
import {
  detectArrayEnd,
  detectObjectEnd,
  parseDynaticCSS,
  type NameslessStyleOrderedChunks,
} from "@packages/dynatic-css-typescript-parser";
import { hashString } from "@packages/dynatic-css-hash";
import { parseCSS } from "./parseCSS";
import { replaceSubstring } from "@packages/utils";
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { addImportIfNotExists, removeImportIfExists } from "@packages/typescript-file-manipulation";
import { buildConfig } from "./buildConfig";

export const dynaticPlugin = (): Plugin => {
  const identifier = 'dynatic-css.config"';
  let isBuild = false;

  const inserted = new Map<string, string>();
  let projectRoot = "";

  return {
    name: "my-plugin",
    enforce: "pre", // <- critical to run *before* React/esbuild plugins
    // apply: "build",
    // config(config, { command }) {
    //   isBuild = command === "build";
    // },
    configResolved(resolvedConfig) {
      projectRoot = resolvedConfig.root;
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
      if (isBuild) {
        return;
      }

      const index = code.indexOf(identifier);

      if (index === -1) {
        return;
      }

      const {
        dynaticStyleChunks,
        dynaticStyleOrderedChunks,
        nameslessStyleOrderedChunks,
        uniqueImports,
        mappedImports,
        importVariables,
        contexts,
        classNames,
      } = parseDynaticCSS({ input: code, identifier });

      const orderedClassNames = classNames.sort(
        (classA, classB) => classA.endIndex - classB.endIndex,
      );

      const parsedDynaticChunks: Record<
        string,
        Record<
          string,
          {
            startIndex: number;
            endIndex: number;
            newValue: string;
            isFullyStatic: boolean;
          }
        >
      > = {};

      const ordered: (NameslessStyleOrderedChunks[number] & { name?: string })[] = [
        ...dynaticStyleOrderedChunks,
        ...nameslessStyleOrderedChunks,
      ].sort((chunkA, chunkB) => chunkB.endIndex - chunkA.endIndex);

      ordered.forEach((current) => {
        const { name, startIndex, endIndex, value, context, variables } = current;

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
        });

        const classNames: string[] = [];
        let dynamicRows = "";

        output.forEach((row) => {
          if (row.isRowStatic) {
            const hash = hashString({ input: row.value });
            const className = `css-${hash}`;
            if (!inserted.has(className)) {
              inserted.set(className, row.value);
            }

            classNames.push(className);
          } else {
            dynamicRows += `${row.value};\n `;
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

        if (!parsedDynaticChunks[context]) {
          parsedDynaticChunks[context] = {};
        }

        const isFullyStatic = dynamicRows.length === 0;

        if (name) {
          parsedDynaticChunks[context][name] = {
            startIndex,
            endIndex,
            newValue: fullResult,
            isFullyStatic,
          };
        }

        code = replaceSubstring({
          str: code,
          from: startIndex,
          to: endIndex,
          newStr: isFullyStatic ? `"${fullResult}"` : fullResult,
        });
      });

      let updatedCSSFile = "";

      const staticClasses: string[] = [];

      for (const [key, value] of inserted.entries()) {
        staticClasses.push(key);
        updatedCSSFile += `.${key} { ${value} }\n`;
      }

      const filePath = `${projectRoot}/src/dynatic-css.config.ts`;
      const fileText = readFileSync(filePath, { encoding: "utf-8" });

      const configIdentifier = "const config = {";
      const startIndexConfig = fileText.indexOf(configIdentifier);
      const updatedStart = startIndexConfig + configIdentifier.length - 1;
      const { endIndex } = detectObjectEnd({
        input: fileText,
        startIndex: updatedStart + 1,
      });

      const configString = fileText.slice(updatedStart, endIndex);
      const config = buildConfig({ configString });

      const classesIdentifier = "const classes: string[] = [";
      const startIndex = fileText.indexOf(classesIdentifier);

      if (startIndex !== -1) {
        const updatedStart = startIndex + classesIdentifier.length - 1;

        const { endIndex } = detectArrayEnd({
          input: fileText,
          startIndex: updatedStart + 1,
        });

        const updatedFileText = replaceSubstring({
          str: fileText,
          from: updatedStart,
          to: endIndex + 1,
          newStr: `[${staticClasses.map((className) => `"${className}"`).join(", ")}]`,
        });

        writeFileSync(filePath, updatedFileText);
      }

      const file = "generated.css";

      const path = `${projectRoot}/src/${file}`;
      writeFileSync(path, updatedCSSFile);

      const mainFile = `${projectRoot}/src/main.tsx`;
      const content = readFileSync(mainFile, "utf-8");

      const importPath = `./${file}`;
      let updatedFile: string;

      if (updatedCSSFile.length > 0) {
        updatedFile = addImportIfNotExists({
          file: content,
          importPath,
          importStatement: `\nimport "${importPath}";`,
        });
      } else {
        updatedFile = removeImportIfExists({
          file: content,
          importPath,
        });
      }

      writeFileSync(mainFile, updatedFile);

      return code;
    },
    generateBundle: () => {
      const insertedValues = inserted.entries();
      const length = [...insertedValues].length;

      if (length === 0) {
        return;
      }

      let updatedCSSFile = "";

      const staticClasses: string[] = [];

      for (const [key, value] of insertedValues) {
        staticClasses.push(key);
        updatedCSSFile += `.${key} { ${value} }\n`;
      }

      const file = "generated.css";

      const path = `${projectRoot}/src/${file}`;

      const mainFile = `${projectRoot}/src/main.tsx`;
      const content = readFileSync(mainFile, "utf-8");

      const importPath = `./${file}`;
      let updatedFile: string;

      const staticClassesPath = `${projectRoot}/src/static-classes.json`;

      if (updatedCSSFile.length > 0) {
        writeFileSync(path, updatedCSSFile);

        updatedFile = addImportIfNotExists({
          file: content,
          importPath,
          importStatement: `\nimport "${importPath}";`,
        });

        writeFileSync(staticClassesPath, JSON.stringify(staticClasses, null, 2));
      } else {
        unlinkSync(path);

        updatedFile = removeImportIfExists({
          file: content,
          importPath,
        });

        unlinkSync(staticClassesPath);
      }

      writeFileSync(mainFile, updatedFile);
    },
  };
};
