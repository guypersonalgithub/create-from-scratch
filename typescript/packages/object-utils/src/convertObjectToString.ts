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
        formattedValue = `${convertArrayToString({ arr: value })},`;
      } else if (value !== null) {
        formattedValue = `${convertObjectContentToString({
          obj: value,
          indentLevel: indentLevel + 1,
        })},`;
      } else {
        formattedValue = `${value},`;
      }
    } else {
      if (stringifyValues) {
        const isString = typeof value === "string";
        const adjustedValue = isString ? `"${value}"` : value;

        formattedValue = `${adjustedValue},`;
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
};

export const convertArrayToString = ({ arr }: ConvertArrayToStringArgs): string => {
  const formatted = arr
    .map((cell) => {
      if (Array.isArray(cell)) {
        return convertArrayToString({ arr: cell });
      } else if (typeof cell === "object" && cell !== null) {
        return convertObjectContentToString({ obj: cell });
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
