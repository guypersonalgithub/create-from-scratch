import type { Exports } from "@packages/export-parser/src/types";
import { parseImports } from "@packages/import-parser";
import { getRelatedImports } from "./getRelatedImports";
import { parseExports } from "@packages/export-parser";

type IterateOverFileArgs = {
  input: string;
  completePath: string;
  mappedAliases: Record<string, string>;
  includeRelatedExports?: boolean;
};

export const iterateOverFile = ({
  input,
  completePath,
  mappedAliases,
  includeRelatedExports,
}: IterateOverFileArgs) => {
  const { imports, currentIndex } = parseImports({ input });
  let currentExports: Exports | undefined;
  let relatedExports: {
    path: string;
    isPackage: boolean;
  }[] = [];

  if (completePath.endsWith("index.ts")) {
    const { exports } = parseExports({ input: input.slice(currentIndex) });
    currentExports = exports;

    if (includeRelatedExports) {
      relatedExports = getRelatedImports({ imports: exports, mappedAliases });
    }
  }

  return {
    imports,
    exports: currentExports,
    relatedExports,
    currentIndex,
  };
};
