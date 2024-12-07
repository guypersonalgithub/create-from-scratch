import { setNestedKey } from "./setNestedKey";

type ConvertStringToObjectWithStringPropertiesArgs = {
  str: string;
};

export type ParsedObject = {
  [key: string]: string | ParsedObject;
};

export const convertStringToObjectWithStringProperties = ({
  str,
}: ConvertStringToObjectWithStringPropertiesArgs) => {
  const object: ParsedObject = {};
  let currentKey = "";
  let currentValue = "";
  let isInValue = false;
  let isInParenthesis = false;
  const nestingKeys: string[] = [];

  const lines = str.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "}" || trimmed === "},") {
      nestingKeys.pop();
      continue;
    }

    const keyValueMatch = trimmed.match(/^"?([\w@./-]+)"?:\s*(.*?),?\s*$/);
    if (keyValueMatch) {
      currentKey = keyValueMatch[1].replace(/^"|"$/g, "");
      currentValue = keyValueMatch[2];
      isInValue = !keyValueMatch[0].endsWith(",") && !keyValueMatch[0].endsWith("{");
      if (keyValueMatch[0].endsWith("(")) {
        isInParenthesis = true;
      }

      if (currentValue === "{}") {
        if (currentKey) {
          nestingKeys.push(currentKey);
        }

        setNestedKey({
          obj: object,
          keys: nestingKeys,
        });

        if (currentKey) {
          nestingKeys.pop();
        }

        continue;
      }

      if (currentKey && currentValue !== "{" && !isInValue) {
        const trimmedValue = currentValue.trim();
        setNestedKey({
          obj: object,
          keys: nestingKeys,
          valueKey: currentKey,
          value: trimmedValue,
        });
      } else if (currentValue === "{") {
        nestingKeys.push(currentKey);
        currentValue = "";
      }
    } else if (isInValue || isInParenthesis) {
      currentValue += ` ${trimmed}`;
      if (trimmed.endsWith(",")) {
        if (trimmed[trimmed.length - 2] === ")") {
          isInParenthesis = false;
        }

        isInValue = false;
      } else if (trimmed.endsWith(")")) {
        isInParenthesis = false;
      }

      if (!isInValue && !isInParenthesis) {
        const trimmedValue = currentValue.trim();
        setNestedKey({
          obj: object,
          keys: nestingKeys,
          valueKey: currentKey,
          value: trimmedValue,
        });
      }
    }
  }

  return { object };
};
