import { replaceOrInsertCharactersInRange } from "@packages/utils";
import { getImportsInFile } from "./getImportsInFile";

type RemoveImportIfExistsArgs = {
  file: string;
  imports?: string[];
  importPackage: string;
};

export const removeImportIfExists = ({
  file,
  imports = getImportsInFile({ file }),
  importPackage,
}: RemoveImportIfExistsArgs) => {
  const importFrom = `from "${importPackage}"`;
  const alreadyHasImport = imports.some((imp) => imp.includes(importFrom));
  if (!alreadyHasImport) {
    return file;
  }

  const importStatement = imports.find((imp) => imp.includes(importFrom));
  if (!importStatement) {
    return file;
  }

  const startIndex = file.indexOf(importStatement);
  const endIndex = startIndex + importStatement.length;

  const updatedFile = replaceOrInsertCharactersInRange({
    str: file,
    startIndex,
    endIndex,
    newChars: "",
  });

  return updatedFile;
};
