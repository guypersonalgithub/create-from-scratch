type ConvertObjectToStringArgs = {
  obj: Object;
  indentLevel?: number;
};

export const convertObjectToString = ({
  obj,
  indentLevel = 0,
}: ConvertObjectToStringArgs): string => {
  if (Array.isArray(obj)) {
    return convertArrayToString({ arr: obj });
  }

  const indent = "  ".repeat(indentLevel);
  const entries = Object.entries(obj);

  const formattedEntries = entries.map(([key, value]) => {
    let formattedValue;

    if (typeof value === "object" && value !== null) {
      formattedValue = `\n${convertObjectToString({
        obj: value,
        indentLevel: indentLevel + 1,
      })}\n${indent}`;
    } else {
      formattedValue = value;
    }

    const shouldHaveQuotationMarks =
      key.includes("-") || key.includes("/") || key === "@" || key === "~";
    const fullKey = shouldHaveQuotationMarks ? `${indent}"${key}"` : `${indent}${key}`;
    return `${fullKey}: ${formattedValue}`;
  });

  return `{${formattedEntries.length > 0 ? `\n${formattedEntries.join(",\n")}\n${indent}` : ""}}`;
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
