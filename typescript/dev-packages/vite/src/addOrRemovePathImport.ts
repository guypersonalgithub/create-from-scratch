import {
  addImportIfNotExists,
  getImportsInFile,
  removeImportIfExists,
} from "@packages/typescript-file-manipulation";

type AddOrRemovePathImportArgs = {
  file: string;
  importPackage: string;
  importStatement: string;
};

export const addOrRemovePathImport = ({ file }: AddOrRemovePathImportArgs) => {
  const importPackage = "path";
  const imports = getImportsInFile({ file });
  const shouldHavePathImport = file.indexOf("path.");
  if (shouldHavePathImport === -1) {
    return removeImportIfExists({ file, imports, importPackage });
  }

  return addImportIfNotExists({
    file,
    imports,
    importPackage,
    importStatement: 'import path from "path"',
  });
};
