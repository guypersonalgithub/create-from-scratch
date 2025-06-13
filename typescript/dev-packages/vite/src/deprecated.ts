import { readFileSync, readdirSync, writeFileSync } from "fs";
import { getProjectAbsolutePath, getRelativePath } from "@packages/paths";
import { detectUsedLocalPackages } from "@packages/packages";
import ts from "typescript";
import { addNewImport, extractExportDefault, generateObjectProperties } from "@packages/typescript";
import { formatCodeWithESLint } from "@packages/eslint";

type UpdateViteConfigLocalDependenciesAliasesArgs = {
  folders: string[];
};

export const updateViteConfigLocalDependenciesAliasesOld = async (
  { folders }: UpdateViteConfigLocalDependenciesAliasesArgs = { folders: ["apps"] },
) => {
  const projectAbsolutePath = getProjectAbsolutePath();

  for await (const folder of folders) {
    const folderPath = `${projectAbsolutePath}/${folder}`;
    const workspaces = readdirSync(folderPath);

    for await (const workspace of workspaces) {
      try {
        const path = `${folderPath}/${workspace}/vite.config.ts`;
        const file = readFileSync(path, {
          encoding: "utf-8",
          flag: "r",
        });

        const workspacePackages = detectUsedLocalPackages({
          workspace: `${folder}/${workspace}`,
          projectAbsolutePath,
        });

        const workspacePackagesPaths = workspacePackages.map((workspacePackage) => {
          return workspacePackage.path;
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
          workspacePackages: workspacePackagesPaths,
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
  }
};

type TransformExportDefaultArgs = {
  sourceFile: ts.SourceFile;
  node: ts.Node;
  workspacePackages: string[];
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

  workspacePackages.forEach((pack) => {
    const packageName = pack.split("/")?.[1];
    newExportDefault.resolve.alias[pack] = {
      __expression: {
        callee: "path.resolve",
        arguments: ["__dirname", `${relativePath}/${packageName}/src/index.ts`],
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
