import ts from "typescript";

type Object = {
  [key: string]: Object | NestedExpression | unknown;
};

type NestedExpression = {
  __expression: {
    callee: string;
    arguments: string[];
  };
};

type GenerateObjectPropertiesArgs = {
  baseExpression?: ts.ObjectLiteralExpression;
  objectStructure: Object;
};

export const generateObjectProperties = ({
  baseExpression = ts.factory.createObjectLiteralExpression([]),
  objectStructure,
}: GenerateObjectPropertiesArgs) => {
  const propertiesMap: Map<string, ts.PropertyAssignment> = new Map();

  // Add existing properties to the map
  baseExpression.properties.forEach((prop) => {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
      propertiesMap.set(prop.name.text, prop);
    } else if (ts.isPropertyAssignment(prop) && ts.isStringLiteral(prop.name)) {
      propertiesMap.set(prop.name.text, prop);
    }
  });

  // Process new properties from objectStructure
  for (const property in objectStructure) {
    const value = objectStructure[property];
    const existingProperty = propertiesMap.get(property);
    let expression: ts.Expression;

    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value as NestedExpression)?.__expression
    ) {
      // If existing property is an object, merge it recursively
      if (
        existingProperty &&
        ts.isPropertyAssignment(existingProperty) &&
        ts.isObjectLiteralExpression(existingProperty.initializer)
      ) {
        expression = generateObjectProperties({
          baseExpression: existingProperty.initializer,
          objectStructure: value as Object,
        });
      } else {
        // Create a new object if the existing property is not an object
        expression = generateObjectProperties({ objectStructure: value as Object });
      }
    } else {
      // Create the appropriate expression for non-object types
      expression = createExpression({ value });
    }

    const propertyAssignment = ts.factory.createPropertyAssignment(
      createPropertyName({ name: property }),
      expression,
    );

    // Update or add the property in the map
    propertiesMap.set(property, propertyAssignment);
  }

  // Convert the map back to an array of properties
  const properties = Array.from(propertiesMap.values());

  return ts.factory.createObjectLiteralExpression(properties, true);
};

type IsValidIdentifierArgs = {
  name: string;
};

const isValidIdentifier = ({ name }: IsValidIdentifierArgs) => {
  // Regular expression to check if a name is a valid JavaScript identifier
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
};

type CreatePropertyNameArgs = {
  name: string;
};

const createPropertyName = ({ name }: CreatePropertyNameArgs): ts.PropertyName => {
  return isValidIdentifier({ name })
    ? ts.factory.createIdentifier(name)
    : ts.factory.createStringLiteral(name);
};

type CreateExpressionArgs = {
  value: unknown;
};

const createExpression = ({ value }: CreateExpressionArgs): ts.Expression => {
  if (typeof value === "string") {
    return ts.factory.createStringLiteral(value);
  } else if (typeof value === "number") {
    return ts.factory.createNumericLiteral(value);
  } else if (typeof value === "boolean") {
    return value ? ts.factory.createTrue() : ts.factory.createFalse();
  } else if (Array.isArray(value)) {
    const elements = value.map((value) => {
      return createExpression({ value });
    });

    return ts.factory.createArrayLiteralExpression(elements);
  } else if (typeof value === "object") {
    const objectValue = value as
      | Object
      | {
          __expression?: {
            callee: string;
            arguments: string[];
          };
        };

    if (objectValue && objectValue.__expression) {
      // Handle complex expressions like function calls
      const expression = objectValue.__expression as NestedExpression["__expression"];

      return ts.factory.createCallExpression(
        ts.factory.createIdentifier(expression.callee),
        undefined,
        expression.arguments.map((value) => {
          return createExpression({ value });
        }),
      );
    }

    return generateObjectProperties({ objectStructure: objectValue });
  } else {
    throw new Error(`Unsupported value type: ${typeof value}`);
  }
};
