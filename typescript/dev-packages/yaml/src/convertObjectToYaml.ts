import { ObjectType } from "./types";

type ConvertObjectToYamlArgs = {
  obj: ObjectType;
  indentLevel?: number;
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
      const isString = typeof value === "string";
      const isMultiline = isString && value.includes("\n");
      const isRunCommand = isString && key === "run";
      const prefix = `${shouldIndent ? indent : ""}`;

      if (isMultiline || isRunCommand) {
        const splitValue = value
          .split("\n")
          .map((part) => part.trim())
          .filter((part) => part.length > 0);
        const moreThanOneCommand = splitValue.length > 1;

        yamlStr += `${prefix}${key}: ${moreThanOneCommand ? "|\n" : ""}`;
        yamlStr +=
          splitValue
            .map((line) => `${moreThanOneCommand ? "  ".repeat(indentLevel + 1) : ""}${line}`)
            .join("\n") + "\n";
      } else {
        yamlStr += `${prefix}${key}: ${escapeValue({ value })}\n`;
      }
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

  if (value === undefined) {
    return "";
  }

  return value;
};
