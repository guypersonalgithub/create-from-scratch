import { readFileSync } from "fs";
import { parseImports } from "@packages/import-parser";
import { parseExports } from "@packages/export-parser";
import { join } from "path";
import { getRelatedImports } from "./getRelatedImports";
import { extractDirectoryPath } from "./extractDirectoryPath";
import type { Exports } from "@packages/export-parser/src/types";
import type { FullPathData } from "./types";

const fileTypes = [
  ".tsx",
  ".ts",
  // ".jsx", ".js"
];

type RecursivelyIterateFilesArgs = {
  absolutePath: string;
  startingFile: string;
  mappedAliases: Record<string, string>;
};

// Currently this is a naive approach that iterates over everything that is found in the tree recursively.
export const recursivelyIterateFiles = ({
  absolutePath,
  startingFile,
  mappedAliases,
}: RecursivelyIterateFilesArgs) => {
  const iteratedPaths = new Set<string>();
  const fullPaths = new Map<string, FullPathData>();

  recursiveIteration({
    currentPath: startingFile,
    absolutePath,
    iteratedPaths,
    mappedAliases,
    fullPaths,
  });

  return fullPaths;
};

type RecursiveIterationArgs = {
  currentPath: string;
  absolutePath: string;
  iteratedPaths: Set<string>;
  mappedAliases: Record<string, string>;
  isPackage?: boolean;
  fullPaths: Map<string, FullPathData>;
};

const recursiveIteration = ({
  currentPath,
  absolutePath,
  iteratedPaths,
  mappedAliases,
  isPackage,
  fullPaths,
}: RecursiveIterationArgs) => {
  const fullPath = isPackage ? currentPath : join(absolutePath, currentPath);

  if (iteratedPaths.has(fullPath)) {
    return;
  }

  iteratedPaths.add(fullPath);
  let completePath = fullPath.replace(/\\/g, "/");

  let input: string | undefined;

  const suffixAlreadyExists = !!fileTypes.find((fileType) => completePath.endsWith(fileType));

  if (!suffixAlreadyExists) {
    for (let i = 0; i < fileTypes.length; i++) {
      const currentPath = `${completePath}${fileTypes[i]}`;

      try {
        input = readFileSync(currentPath, "utf-8");
        completePath = currentPath;
        // fullPaths.add(currentPath);
        break;
      } catch (error) {
        // console.error(currentPath);
      }
    }

    if (!input) {
      for (let i = fileTypes.length - 1; i >= 0; i--) {
        const currentPath = `${completePath}/index${fileTypes[i]}`;
        try {
          input = readFileSync(currentPath, "utf-8");
          completePath = currentPath;
          // fullPaths.add(currentPath);
          break;
        } catch (error) {
          // console.error(currentPath);
        }
      }
    }
  } else {
    try {
      input = readFileSync(completePath, "utf-8");
      // fullPaths.add(completePath);
    } catch (error) {
      console.error(error);
    }
  }

  if (!input) {
    return;
  }

  const { imports, currentIndex } = parseImports({ input });
  let currentExports: Exports | undefined;
  let relatedExports: {
    path: string;
    isPackage: boolean;
  }[] = [];

  const relatedImports = getRelatedImports({ imports, mappedAliases });
  const newAbsolutePath = extractDirectoryPath({ path: completePath });

  if (completePath.endsWith("index.ts")) {
    const { exports } = parseExports({ input: input.slice(currentIndex) });
    currentExports = exports;
    relatedExports = getRelatedImports({ imports: exports, mappedAliases });
  }

  fullPaths.set(completePath, {
    imports,
    exports: currentExports,
    currentIndex,
    input,
  });

  relatedImports.forEach(({ path, isPackage }) => {
    recursiveIteration({
      currentPath: path,
      absolutePath: newAbsolutePath,
      iteratedPaths,
      mappedAliases,
      isPackage,
      fullPaths,
    });
  });

  relatedExports.forEach(({ path, isPackage }) => {
    recursiveIteration({
      currentPath: path,
      absolutePath: newAbsolutePath,
      iteratedPaths,
      mappedAliases,
      isPackage,
      fullPaths,
    });
  });
};
