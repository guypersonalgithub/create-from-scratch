import {
  addImportIfNotExists,
  getImportsInFile,
  removeImportIfExists,
} from "@packages/typescript-file-manipulation";

type AddOrRemovePathImportArgs = {
  file: string;
  importPath: string;
  importStatement: string;
};

export const addOrRemovePathImport = ({ file }: AddOrRemovePathImportArgs) => {
  const importPath = "path";
  const imports = getImportsInFile({ file });
  const shouldHavePathImport = file.indexOf("path.");
  if (shouldHavePathImport === -1) {
    return removeImportIfExists({ file, imports, importPath });
  }

  return addImportIfNotExists({
    file,
    imports,
    importPath,
    includeImportPathFrom: true,
    importStatement: 'import path from "path"',
  });
};
