import ts from "typescript";

type ImportAlreadyExistsArgs = {
  sourceFile: ts.SourceFile;
  moduleName: string;
  importName?: string;
};

export const importAlreadyExists = ({
  sourceFile,
  moduleName,
  importName,
}: ImportAlreadyExistsArgs) => {
  let exists = false;

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isImportDeclaration(node)) {
      const importClause = node.importClause;
      const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;

      if (moduleSpecifier === moduleName) {
        if (!importName) {
          exists = true;
          return;
        }

        if (importClause) {
          if (importClause.name && importClause.name.text === importName) {
            exists = true;
            return;
          }

          if (importClause.namedBindings) {
            if (ts.isNamespaceImport(importClause.namedBindings)) {
              if (importClause.namedBindings.name.text === importName) {
                exists = true;
                return;
              }
            } else if (ts.isNamedImports(importClause.namedBindings)) {
              for (const element of importClause.namedBindings.elements) {
                if (element.name.text === importName) {
                  exists = true;
                  return;
                }
              }
            }
          }
        }
      }
    }
  });

  return exists;
};
