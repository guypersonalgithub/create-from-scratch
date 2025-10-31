import { replaceOrInsertCharactersInRange } from "@packages/string-utils";
import { getImportsInFile } from "./getImportsInFile";

type AddImportIfNotExistsArgs = {
  file: string;
  imports?: string[];
  importPath: string;
  includeImportPathFrom?: boolean;
  importStatement: string;
};

export const addImportIfNotExists = ({
  file,
  imports = getImportsInFile({ file }),
  importPath,
  includeImportPathFrom,
  importStatement,
}: AddImportIfNotExistsArgs) => {
  const alreadyHasImport = imports.some((imp) =>
    imp.includes(`${includeImportPathFrom ? "from" : ""} "${importPath}"`),
  );
  if (alreadyHasImport) {
    return file;
  }

  const lastImport = imports[imports.length - 1];
  const startIndex = file.indexOf(lastImport);
  const endIndex = startIndex + lastImport.length;

  const updatedFile = replaceOrInsertCharactersInRange({
    str: file,
    startIndex: endIndex,
    newChars: importStatement,
  });

  return updatedFile;
};
