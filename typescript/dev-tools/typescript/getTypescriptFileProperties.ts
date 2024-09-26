import ts from "typescript";

type GetTypescriptFilePropertiesArgs = {
  path: string;
  file: string;
};

export const getTypescriptFileProperties = ({ path, file }: GetTypescriptFilePropertiesArgs) => {
  const sourceFile = ts.createSourceFile(path, file, ts.ScriptTarget.Latest, true);

  // Arrays to hold extracted information
  const imports: string[] = [];
  const exports: string[] = [];
  const constants: string[] = [];
  const lets: string[] = [];
  let defaultExport: string | null = null;

  // Traverse the AST starting from the source file
  visit({ file, node: sourceFile, imports, exports, constants, lets, defaultExport });

  const allData = {
    imports,
    exports,
    constants,
    lets,
    defaultExport,
  };

  console.log(allData);
  return allData;
};

type GetNodeTextArgs = {
  file: string;
  node: ts.Node;
};

const getNodeText = ({ file, node }: GetNodeTextArgs) => {
  return file.substring(node.getStart(), node.getEnd());
};

type VisitArgs = {
  file: string;
  node: ts.Node;
  imports: string[];
  exports: string[];
  constants: string[];
  lets: string[];
  defaultExport: string | null;
};

const visit = ({ file, node, imports, exports, constants, lets, defaultExport }: VisitArgs) => {
  if (ts.isImportDeclaration(node)) {
    // Extract import statements
    imports.push(getNodeText({ file, node }));
  } else if (ts.isExportDeclaration(node)) {
    // Extract export statements
    if (node.exportClause && node.exportClause.kind === ts.SyntaxKind.NamedExports) {
      // Named exports
      exports.push(getNodeText({ file, node }));
    } else if (node.exportClause && node.exportClause.kind === ts.SyntaxKind.NamespaceExport) {
      // Namespace export
      exports.push(getNodeText({ file, node }));
    }
  } else if (ts.isExportAssignment(node)) {
    // Extract default export
    defaultExport = getNodeText({ file, node });
  } else if (ts.isVariableStatement(node)) {
    // Extract constants and lets
    node.declarationList.declarations.forEach((declaration) => {
      if (ts.isVariableDeclaration(declaration)) {
        // Check for modifiers by iterating over children
        let hasConstModifier = false;
        let hasLetModifier = false;
        ts.forEachChild(declaration, (child) => {
          if (ts.isToken(child)) {
            if (child.kind === ts.SyntaxKind.ConstKeyword) {
              hasConstModifier = true;
            } else if (child.kind === ts.SyntaxKind.LetKeyword) {
              hasLetModifier = true;
            }
          }
        });

        if (hasConstModifier) {
          constants.push(getNodeText({ file, node: declaration }));
        } else if (hasLetModifier) {
          lets.push(getNodeText({ file, node: declaration }));
        }
      }
    });
  }

  // Continue traversing the AST
  ts.forEachChild(node, (node) =>
    visit({ file, node, imports, exports, constants, lets, defaultExport }),
  );
};
