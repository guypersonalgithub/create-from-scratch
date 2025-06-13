import ts from "typescript";

type UpdateExportDefaultObjectArgs = {
  sourceFile: ts.SourceFile;
  node: ts.Node;
};

export const updateExportDefaultObject = ({ sourceFile, node }: UpdateExportDefaultObjectArgs) => {
  const newAlias = "test";
  const newValue = "testing";
  const exportAssignment = node as ts.ExportAssignment;
  const expression = exportAssignment.expression;

  function updateObjectLiteral(expression: ts.ObjectLiteralExpression): ts.ObjectLiteralExpression {
    const properties = expression.properties.slice();
    let resolveProperty = properties.find(
      (prop) =>
        ts.isPropertyAssignment(prop) &&
        ts.isIdentifier(prop.name) &&
        prop.name.text === "resolve" &&
        ts.isObjectLiteralExpression(prop.initializer),
    ) as ts.PropertyAssignment | undefined;

    if (!resolveProperty) {
      console.log("No resolve property found, creating new resolve with alias.");
      // Create resolve and alias if resolve doesn't exist
      const aliasProperty = ts.factory.createPropertyAssignment(
        "alias",
        ts.factory.createObjectLiteralExpression([
          ts.factory.createPropertyAssignment(newAlias, ts.factory.createStringLiteral(newValue)),
        ]),
      );
      resolveProperty = ts.factory.createPropertyAssignment(
        "resolve",
        ts.factory.createObjectLiteralExpression([aliasProperty]),
      );
      properties.push(resolveProperty);
    } else {
      console.log("Resolve property found.");
      // Check if alias exists within resolve
      const resolveObject = resolveProperty.initializer as ts.ObjectLiteralExpression;
      let aliasProperty = resolveObject.properties.find(
        (prop) =>
          ts.isPropertyAssignment(prop) &&
          ts.isIdentifier(prop.name) &&
          prop.name.text === "alias" &&
          ts.isObjectLiteralExpression(prop.initializer),
      ) as ts.PropertyAssignment | undefined;

      if (!aliasProperty) {
        console.log("No alias property found within resolve, creating new alias.");
        // If alias doesn't exist, create it
        aliasProperty = ts.factory.createPropertyAssignment(
          "alias",
          ts.factory.createObjectLiteralExpression([
            ts.factory.createPropertyAssignment(newAlias, ts.factory.createStringLiteral(newValue)),
          ]),
        );

        // Add alias to resolve
        const newResolveObject = ts.factory.createObjectLiteralExpression([
          ...resolveObject.properties,
          aliasProperty,
        ]);
        resolveProperty = ts.factory.createPropertyAssignment("resolve", newResolveObject);
        properties[properties.indexOf(resolveProperty)] = resolveProperty;
      } else {
        console.log("Alias property already exists within resolve.");
      }
    }

    return ts.factory.createObjectLiteralExpression(properties, true);
  }

  let newExpression: ts.Expression;
  if (ts.isObjectLiteralExpression(expression)) {
    newExpression = updateObjectLiteral(expression);
  } else if (ts.isCallExpression(expression)) {
    console.log(expression.arguments);
    const args = expression.arguments.map((arg) => {
      if (ts.isObjectLiteralExpression(arg)) {
        return updateObjectLiteral(arg);
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
    console.log("Export default is not an object literal or call expression.");

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
