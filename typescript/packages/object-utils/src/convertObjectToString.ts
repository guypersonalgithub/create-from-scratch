type ConvertObjectToStringArgs = {
  obj: Object;
  indentLevel?: number;
  baseIndent?: string;
};

export const convertObjectToString = ({
  obj,
  indentLevel = 0,
  baseIndent = "  ",
}: ConvertObjectToStringArgs): string => {
  const indent = baseIndent.repeat(indentLevel);

  const entries = Object.entries(obj);

  const formattedEntries = entries.map(([key, value]) => {
    let formattedValue = "";

    const shouldHaveQuotationMarks =
      key.includes("-") || key.includes("/") || key === "@" || key === "~";
    const fullKey = shouldHaveQuotationMarks ? `${indent}"${key}"` : `${indent}${key}`;

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return `${fullKey}: ${convertArrayToString({ arr: value })} \n`;
      }
    }
    if (typeof value === "object" && value !== null) {
      formattedValue = `\n${convertObjectToString({
        obj: value,
        indentLevel: indentLevel + 1,
      })}\n${indent}`;
    } else {
      formattedValue = value;
    }

    return `${fullKey}: ${formattedValue} \n`;
  });

  return `${indent}{${formattedEntries.length > 0 ? `\n${indent}${formattedEntries.join(",\n")}${indent}` : ""}}`;
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
        return convertObjectToString({ obj: cell });
      } else {
        return `${cell}`;
      }
    })
    .join(", ");

  return `[${formatted}]`;
};
