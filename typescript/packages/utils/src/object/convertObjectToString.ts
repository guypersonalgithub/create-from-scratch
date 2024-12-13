type ConvertObjectToStringArgs = {
  obj: Object;
  indentLevel?: number;
};

export const convertObjectToString = ({
  obj,
  indentLevel = 0,
}: ConvertObjectToStringArgs): string => {
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
