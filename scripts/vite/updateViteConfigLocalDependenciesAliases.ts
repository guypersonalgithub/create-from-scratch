import { readFileSync, readdirSync, writeFileSync } from "fs";
import { getProjectAbsolutePath, getRelativePath } from "../paths";
import { detectWorkspacePackages } from "../packages";
import ts from "typescript";
import { addNewImport, extractExportDefault, generateObjectProperties } from "../typescript";
import { formatCodeWithESLint } from "../eslint";

export const updateViteConfigLocalDependenciesAliases = async () => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const folderPath = `${projectAbsolutePath}/apps`;
  const workspaces = readdirSync(folderPath);

  for await (const workspace of workspaces) {
    try {
      const path = `${folderPath}/${workspace}/vite.config.ts`;
      const file = readFileSync(path, {
        encoding: "utf-8",
        flag: "r",
      });

      const workspacePackages = detectWorkspacePackages({
        workspace: `apps/${workspace}`,
        projectAbsolutePath,
      });

      let sourceFile = ts.createSourceFile(
        path,
        file,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );

      sourceFile = addNewImport({
        node: sourceFile,
        importedFrom: "path",
        defaultImport: "path",
      });

      const exportDefaultExpression = extractExportDefault({ sourceFile });
      if (!exportDefaultExpression) {
        return;
      }

      const relativePath = getRelativePath({
        from: `${folderPath}/${workspace}`,
        to: `${projectAbsolutePath}/packages`,
      });

      const updatedExportDefault = transformExportDefault({
        sourceFile,
        node: exportDefaultExpression,
        workspacePackages,
        relativePath,
      });

      const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
      const modifiedCode = printer.printNode(
        ts.EmitHint.Unspecified,
        updatedExportDefault,
        sourceFile,
      );

      const { output } = await formatCodeWithESLint({ code: modifiedCode });
      writeFileSync(path, output);
    } catch (error) {}
  }
};

type TransformExportDefaultArgs = {
  sourceFile: ts.SourceFile;
  node: ts.Node;
  workspacePackages?: Set<string>;
  relativePath: string;
};

const transformExportDefault = ({
  sourceFile,
  node,
  workspacePackages,
  relativePath,
}: TransformExportDefaultArgs) => {
  const exportAssignment = node as ts.ExportAssignment;
  const expression = exportAssignment.expression;
  const packages = workspacePackages ? [...workspacePackages] : [];

  const newExportDefault: {
    resolve: {
      alias: Record<
        string,
        {
          __expression: {
            callee: string;
            arguments: string[];
          };
        }
      >;
    };
  } = {
    resolve: {
      alias: {},
    },
  };

  packages.forEach((pack) => {
    newExportDefault.resolve.alias[pack] = {
      __expression: {
        callee: "path.resolve",
        arguments: ["__dirname", `${relativePath}/${pack}/src/index.ts`],
      },
    };
  });

  let newExpression: ts.Expression;
  if (ts.isObjectLiteralExpression(expression)) {
    newExpression = generateObjectProperties({
      baseExpression: expression,
      objectStructure: newExportDefault,
    });
  } else if (ts.isCallExpression(expression)) {
    const args = expression.arguments.map((arg) => {
      if (ts.isObjectLiteralExpression(arg)) {
        return generateObjectProperties({ baseExpression: arg, objectStructure: newExportDefault });
      }
      return arg;
    });

    newExpression = ts.factory.updateCallExpression(
      expression,
      expression.expression,
      expression.typeArguments,
      args,
    );
  } else {
    return sourceFile;
  }

  const newExportAssignment = ts.factory.updateExportAssignment(
    exportAssignment,
    exportAssignment.modifiers,
    newExpression,
  );

  // Replace the old node with the new node
  const transformer =
    <T extends ts.Node>(context: ts.TransformationContext) =>
    (rootNode: T) => {
      function visit(node: ts.Node): ts.Node {
        if (node === exportAssignment) {
          return newExportAssignment;
        }
        return ts.visitEachChild(node, visit, context);
      }
      return ts.visitNode(rootNode, visit);
    };

  const result = ts.transform(sourceFile, [transformer]);
  return result.transformed[0] as ts.SourceFile;
};
