import { ObjectType } from "./types";

type ConvertObjectToYamlArgs = {
  obj: ObjectType;
  maintainQuotationsOnNumbers?: boolean;
  baseIndent?: string;
};

export const convertObjectToYaml = ({
  obj,
  maintainQuotationsOnNumbers,
  baseIndent,
}: ConvertObjectToYamlArgs) => parseObjectToYaml({ obj, maintainQuotationsOnNumbers, baseIndent });

type ParseObjectToYamlArgs = {
  obj: ObjectType;
  indentLevel?: number;
  isObject?: boolean;
  maintainQuotationsOnNumbers?: boolean;
  baseIndent?: string;
};

const parseObjectToYaml = ({
  obj,
  indentLevel = 0,
  isObject,
  maintainQuotationsOnNumbers,
  baseIndent = "  ",
}: ParseObjectToYamlArgs) => {
  let yamlStr = "";
  try {
    const indent = baseIndent.repeat(indentLevel);
    let index = 0;

    for (const key in obj) {
      const value = obj[key];

      if (typeof value === "object" && !Array.isArray(value)) {
        if (value !== null) {
          yamlStr += `${indent}${key}:\n${parseObjectToYaml({ obj: value as ObjectType, indentLevel: indentLevel + 1, maintainQuotationsOnNumbers })}`;
        } else {
          yamlStr += `${indent}${key}: null`;
        }
      } else if (Array.isArray(value)) {
        // if (key === "run") {
        //   const moreThanOneCommand = value.length > 1;
        //   yamlStr += `${indent}${key}: ${moreThanOneCommand ? "|\n" : ""}`;
        //   yamlStr +=
        //     value
        //       .map(
        //         (line) =>
        //           `${moreThanOneCommand ? baseIndent.repeat(indentLevel + 1) : ""}${escapeValue({ value: line, maintainQuotationsOnNumbers })}`,
        //       )
        //       .join("\n") + "\n";
        // } else {
        yamlStr += `${indent}${key}:\n`;
        value.forEach((item: unknown) => {
          if (typeof item === "object") {
            yamlStr += `${indent}  - ${parseObjectToYaml({ obj: item as ObjectType, indentLevel: indentLevel + 2, isObject: true, maintainQuotationsOnNumbers })}`;
          } else {
            yamlStr += `${indent}  - ${escapeValue({ value: item, maintainQuotationsOnNumbers })}\n`;
          }
        });
        // }
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
              .map(
                (line) => `${moreThanOneCommand ? baseIndent.repeat(indentLevel + 1) : ""}${line}`,
              )
              .join("\n") + "\n";
        } else {
          yamlStr += `${prefix}${key}: ${escapeValue({ value, maintainQuotationsOnNumbers })}\n`;
        }
      }

      index++;
    }
  } catch (error) {
    console.error(error);
  }

  return yamlStr;
};

type EscapeValueArgs = {
  value: unknown;
  maintainQuotationsOnNumbers?: boolean;
};

const escapeValue = ({ value, maintainQuotationsOnNumbers }: EscapeValueArgs) => {
  if (value === undefined) {
    return "";
  }

  if (maintainQuotationsOnNumbers && typeof value === "string" && !isNaN(Number(value))) {
    return `"${value}"`;
  }
  // if (typeof value === "string" && value.includes(":")) {
  //   return value;
  // }

  return value;
};
