import { readdirSync, writeFileSync } from "fs";
import { getProjectAbsolutePath, getRelativePath } from "@packages/paths";
import { detectUsedLocalPackages } from "@packages/packages";
import { formatCodeWithESLint } from "@packages/eslint";
import { extractObject, getExportDefaultIndex } from "@packages/typescript-file-manipulation";
import { replaceOrInsertCharactersInRange } from "@packages/utils";
import { addOrRemovePathImport } from "./addOrRemovePathImport";
import {
  convertObjectToString,
  convertStringToObjectWithStringProperties,
} from "@packages/object-utils";

type UpdateViteConfigLocalDependenciesAliasesArgs = {
  folders?: string[];
  localPackagesIdentifiers?: string[];
  localPackagePrefix?: string;
};

export const updateViteConfigLocalDependenciesAliases = async ({
  folders = ["apps"],
  localPackagesIdentifiers = [],
  localPackagePrefix = "",
}: UpdateViteConfigLocalDependenciesAliasesArgs) => {
  const projectAbsolutePath = getProjectAbsolutePath();

  for await (const folder of folders) {
    const folderPath = `${projectAbsolutePath}/${folder}`;
    const workspaces = readdirSync(folderPath);

    for await (const workspace of workspaces) {
      try {
        const workspacePackages = detectUsedLocalPackages({
          workspace: `${folder}/${workspace}`,
          projectAbsolutePath,
        });

        const workspacePackagesPaths = workspacePackages.map((workspacePackage) => {
          return workspacePackage.path;
        });

        const filePath = `${folderPath}/${workspace}/vite.config.ts`;
        const { file, startingIndex, isFunction } = getExportDefaultIndex({
          filePath,
        });

        if (!file) {
          continue;
        }

        if (!isFunction) {
          console.error("Expected to find an export default defineConfig function.");

          return;
        }

        const defineConfigLength = "defineConfig".length;
        const functionNameIndex = startingIndex - defineConfigLength;
        if (file.slice(functionNameIndex, startingIndex) !== "defineConfig") {
          console.error("Expected to find an export default defineConfig function.");

          return;
        }

        const startOfObject = startingIndex + 1;

        const isObjectWithinDefineConfig = file.charAt(startOfObject) === "{";
        if (!isObjectWithinDefineConfig) {
          console.error(
            "Expected to find an export default defineConfig function argument as object.",
          );
        }

        const { obj } = extractObject({ file, startIndex: startOfObject });
        const { object } = convertStringToObjectWithStringProperties({
          str: obj,
          removeKeyQuotations: true,
          removeValueQuotations: true,
        });
        if (!object.resolve) {
          object.resolve = {
            alias: {},
          };
        }

        const resolve = object.resolve;
        if (typeof resolve === "string" || Array.isArray(resolve)) {
          continue;
        }

        const alias = resolve.alias;
        if (typeof alias === "string" || Array.isArray(alias)) {
          continue;
        }

        for (const property in alias) {
          for (let i = 0; i < localPackagesIdentifiers.length; i++) {
            const current = `${localPackagePrefix}${localPackagesIdentifiers[i]}`;
            if (property.startsWith(current)) {
              delete alias[property];
              break;
            }
          }
        }

        workspacePackagesPaths.forEach((workspacePackagePath) => {
          const [localPackageIdentifier, packageName] = workspacePackagePath.split("/");
          const completePackageIdentifier = `${localPackagePrefix}${workspacePackagePath}`;

          const relativePath = getRelativePath({
            from: `${folderPath}/${workspace}`,
            to: `${projectAbsolutePath}/${localPackageIdentifier}`,
          });

          alias[completePackageIdentifier] =
            `path.resolve(__dirname, "${relativePath}/${packageName}/src/index.ts")`;
        });

        let updatedFile = replaceOrInsertCharactersInRange({
          str: file,
          startIndex: startOfObject,
          endIndex: startOfObject + obj.length - 1,
          newChars: convertObjectToString({ obj: object }),
        });

        updatedFile = addOrRemovePathImport({
          file: updatedFile,
          importPath: "path",
          importStatement: 'import path from "path"',
        });

        const { output } = await formatCodeWithESLint({ code: updatedFile });
        writeFileSync(filePath, output);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
