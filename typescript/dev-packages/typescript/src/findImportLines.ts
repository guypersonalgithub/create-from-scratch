import ts from "typescript";

export const findImportLines = (sourceFile: ts.SourceFile) => {
  const importLines: number[] = [];

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
      const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      console.log({ node: node.getText(), line: line + 1 });
      importLines.push(line + 1); // Adding 1 to convert zero-based index to one-based index
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return importLines;
};
