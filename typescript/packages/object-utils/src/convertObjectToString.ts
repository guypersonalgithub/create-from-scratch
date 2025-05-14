type ConvertObjectToStringArgs = {
  obj: Object;
  stringifyValues?: boolean;
};

export const convertObjectToString = ({ obj, stringifyValues }: ConvertObjectToStringArgs) =>
  convertObjectContentToString({ obj, stringifyValues });

type ConvertObjectContentToString = {
  obj: Object;
  indentLevel?: number;
  baseIndent?: string;
  stringifyValues?: boolean;
};

const convertObjectContentToString = ({
  obj,
  indentLevel = 0,
  baseIndent = "  ",
  stringifyValues,
}: ConvertObjectContentToString): string => {
  const indent = baseIndent.repeat(indentLevel);
  const valueIndent = indent + baseIndent;

  const entries = Object.entries(obj);

  const formattedEntries = entries.map(([key, value]) => {
    let formattedValue = "";

    const shouldHaveQuotationMarks =
      key.includes("-") || key.includes("/") || key === "@" || key === "~";
    const fullKey = shouldHaveQuotationMarks ? `${valueIndent}"${key}"` : `${valueIndent}${key}`;

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        formattedValue = `${convertArrayToString({ arr: value, stringifyValues })},`;
      } else if (value !== null) {
        formattedValue = `${convertObjectContentToString({
          obj: value,
          indentLevel: indentLevel + 1,
          stringifyValues,
        })},`;
      } else {
        formattedValue = `${value},`;
      }
    } else {
      if (stringifyValues && typeof value === "string") {
        const isString = typeof value === "string";
        const hasMultipleLines = value.includes("\n");
        if (isString && hasMultipleLines) {
          formattedValue = `\`${value}\``;
        } else {
          const adjustedValue = isString ? `"${value}"` : value;

          formattedValue = `${adjustedValue},`;
        }
      } else {
        formattedValue = `${value},`;
      }
    }

    return `${fullKey}: ${formattedValue} \n`;
  });

  return `{${formattedEntries.length > 0 ? `\n${formattedEntries.join("")}${indent}` : ""}}`;
};

type ConvertArrayToStringArgs = {
  arr: unknown[];
  stringifyValues?: boolean;
};

export const convertArrayToString = ({
  arr,
  stringifyValues,
}: ConvertArrayToStringArgs): string => {
  const formatted = arr
    .map((cell) => {
      if (Array.isArray(cell)) {
        return convertArrayToString({ arr: cell, stringifyValues });
      } else if (typeof cell === "object" && cell !== null) {
        return convertObjectContentToString({ obj: cell, stringifyValues });
      } else {
        if (typeof cell === "string" && !cell.endsWith("()")) {
          // TODO: Make the solution more accurate to avoid stringifying unintended values.
          return `"${cell}"`;
        }

        return `${cell}`;
      }
    })
    .join(", ");

  return `[${formatted}]`;
};
