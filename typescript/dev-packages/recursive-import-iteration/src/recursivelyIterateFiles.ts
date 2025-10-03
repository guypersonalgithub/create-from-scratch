import { readFileSync } from "fs";
import { getImportsInFile } from "@packages/typescript-file-manipulation";
import { transformImportsToPaths } from "./transformImportsToPaths";
import { join } from "path";

type RecursivelyIterateFilesArgs = {
  absolutePath: string;
  startingFile: string;
  mappedAliases: Record<string, string>;
};

export const recursivelyIterateFiles = ({
  absolutePath,
  startingFile,
  mappedAliases,
}: RecursivelyIterateFilesArgs) => {
  const iteratedPaths = new Set<string>();

  recursiveIteration({ currentPath: startingFile, absolutePath, iteratedPaths, mappedAliases });
};

type RecursiveIterationArgs = {
  currentPath: string;
  absolutePath: string;
  iteratedPaths: Set<string>;
  mappedAliases: Record<string, string>;
  isPack?: boolean;
};

const recursiveIteration = ({
  currentPath,
  absolutePath,
  iteratedPaths,
  mappedAliases,
  isPack,
}: RecursiveIterationArgs) => {
  const fullPath = isPack ? currentPath : join(absolutePath, "src", currentPath);

  console.log(fullPath);

  if (iteratedPaths.has(fullPath)) {
    return;
  }

  iteratedPaths.add(fullPath);

  const file = readFileSync(fullPath, "utf-8");
  iteratedPaths.add(fullPath);
  const imports = getImportsInFile({ file });
  const transformedPaths = transformImportsToPaths({ imports });

  const fullPaths = transformedPaths
    .map((path) => {
      if (path.startsWith("@packages")) {
        return { value: mappedAliases[path], isPack: true };
      }

      return { value: path };
    })
    .filter(Boolean);

  fullPaths.forEach(({ value, isPack }) => {
    recursiveIteration({ currentPath: value, absolutePath, iteratedPaths, mappedAliases, isPack });
  });
};
