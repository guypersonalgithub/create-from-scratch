type ObjectType = {
  [key: string]: unknown;
};

type ConvertObjectToYamlArgs = {
  obj: ObjectType;
  indentLevel: number;
  isObject?: boolean;
};

export const convertObjectToYaml = ({
  obj,
  indentLevel = 0,
  isObject,
}: ConvertObjectToYamlArgs) => {
  let yamlStr = "";
  const indent = "  ".repeat(indentLevel);
  let index = 0;

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "object" && !Array.isArray(value)) {
      yamlStr += `${indent}${key}:\n${convertObjectToYaml({ obj: value as ObjectType, indentLevel: indentLevel + 1 })}`;
    } else if (Array.isArray(value)) {
      yamlStr += `${indent}${key}:\n`;
      value.forEach((item: unknown) => {
        if (typeof item === "object") {
          yamlStr += `${indent}  - ${convertObjectToYaml({ obj: item as ObjectType, indentLevel: indentLevel + 2, isObject: true })}`;
        } else {
          yamlStr += `${indent}  - ${escapeValue({ value: item })}\n`;
        }
      });
    } else {
      const shouldIndent = isObject ? index > 0 : true;
      yamlStr += `${shouldIndent ? indent : ""}${key}: ${escapeValue({ value })}\n`;
    }

    index++;
  }

  return yamlStr;
};

type EscapeValueArgs = {
  value: unknown;
};

const escapeValue = ({ value }: EscapeValueArgs) => {
  if (typeof value === "string" && value.includes(":")) {
    return `'${value}'`;
  }
  return value;
};
