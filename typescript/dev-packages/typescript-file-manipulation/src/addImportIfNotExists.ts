import { replaceOrInsertCharactersInRange } from "@packages/utils";
import { getImportsInFile } from "./getImportsInFile";

type AddImportIfNotExistsArgs = {
  file: string;
  imports?: string[];
  importPackage: string;
  importStatement: string;
};

export const addImportIfNotExists = ({
  file,
  imports = getImportsInFile({ file }),
  importPackage,
  importStatement,
}: AddImportIfNotExistsArgs) => {
  const alreadyHasImport = imports.some((imp) => imp.includes(`from "${importPackage}"`));
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
