import ts from "typescript";

type ConvertASTBackToCodeArgs = {
  sourceFile: ts.SourceFile;
};

export const convertASTBackToCode = ({ sourceFile }: ConvertASTBackToCodeArgs) => {
  // Create a printer to convert the updated AST back to code
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  // Print the updated source code
  const updatedSourceCode = printer.printFile(sourceFile);

  return updatedSourceCode;
};
