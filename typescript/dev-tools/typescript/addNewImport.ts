import ts from "typescript";
import { importAlreadyExists } from "./importAlreadyExists";

type AddNewImportArgs = {
  node: ts.SourceFile;
  importedFrom: string;
} & (
  | {
      namedImports: string[];
      defaultImport?: never;
    }
  | {
      namedImports?: never;
      defaultImport: string;
    }
);

export const addNewImport = ({
  node,
  importedFrom,
  namedImports,
  defaultImport,
}: AddNewImportArgs) => {
  const alreadyExists = importAlreadyExists({
    sourceFile: node,
    moduleName: importedFrom,
    importName: defaultImport,
  });

  if (alreadyExists) {
    return node;
  }

  const importDeclaration = getImportDeclaration({ importedFrom, defaultImport, namedImports });

  const importEndIndex = node.statements.findIndex((statement) => {
    return !ts.isImportDeclaration(statement);
  });

  const updatedStatements = ts.factory.createNodeArray([
    ...node.statements.slice(0, importEndIndex),
    importDeclaration,
    ...node.statements.slice(importEndIndex),
  ]);

  return ts.factory.updateSourceFile(node, updatedStatements);
};

const getImportDeclaration = ({
  importedFrom,
  defaultImport,
  namedImports,
}: Pick<AddNewImportArgs, "importedFrom" | "defaultImport" | "namedImports">) => {
  if (namedImports) {
    const importSpecifiers = namedImports.map((namedImport) => {
      return ts.factory.createImportSpecifier(
        false,
        undefined,
        ts.factory.createIdentifier(namedImport),
      );
    });

    const importClause = ts.factory.createImportClause(
      false, // Not using default import
      undefined, // No default import
      ts.factory.createNamedImports(importSpecifiers), // Named imports
    );

    const importDeclaration = ts.factory.createImportDeclaration(
      undefined, // No modifiers
      importClause, // Import clause
      ts.factory.createStringLiteral(importedFrom), // Module specifier
    );

    return importDeclaration;
  }

  const importDeclaration = ts.factory.createImportDeclaration(
    undefined, // No modifiers
    ts.factory.createImportClause(
      false,
      ts.factory.createIdentifier(defaultImport as string), // Default import
      undefined, // No named imports
    ),
    ts.factory.createStringLiteral(importedFrom), // Module specifier
  );

  return importDeclaration;
};
