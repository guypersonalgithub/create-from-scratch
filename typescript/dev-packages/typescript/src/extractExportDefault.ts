import ts from "typescript";

type ExtractExportDefaultArgs = { sourceFile: ts.Node };

export const extractExportDefault = ({ sourceFile }: ExtractExportDefaultArgs) => {
  let exportDefaultNode: ts.Node | undefined;

  const visit = (node: ts.Node) => {
    if (ts.isExportAssignment(node) && !node.isExportEquals) {
      exportDefaultNode = node;
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return exportDefaultNode;
};
