import { ObjectType } from "./types";

type ConvertYamlToObjectArgs = {
  str: string;
};

export const convertYamlToObject = ({ str }: ConvertYamlToObjectArgs): ObjectType => {
  const lines = str.split("\n").map((line) => line); // Don't trim, we need indentation
  const result: ObjectType = {};
  let stack: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.trim() || line.trim().startsWith("#")) {
      continue; // Skip empty lines and comments
    }

    const indent = getLineIndent({ line });
    const trimmedLine = line.trim();
    const isListItem = trimmedLine.startsWith("- ");

    if (isListItem) {
      const { listItem, index } = getCompleteListItem({ lines, index: i, indent });
      let parent: ObjectType = result;
      stack.forEach((level, index) => {
        if (index === stack.length - 1 && (!parent[level] || !Array.isArray(parent[level]))) {
          parent[level] = [];
        }

        parent = parent[level] as ObjectType;
      });

      if (!parent || !Array.isArray(parent)) {
        (parent as unknown as unknown[]) = [];
      }

      (parent as unknown as unknown[]).push(listItem);

      i = index;
      continue;
    }

    const { isKeyValueLine, spreaderIndex } = isKeyValue({ line });

    if (indent < stack.length) {
      stack = stack.slice(0, indent);
    }

    let parent: ObjectType = result;
    stack.forEach((level, index) => {
      if (index === stack.length - 1 && !parent[level]) {
        parent[level] = {};
      }

      parent = parent[level] as ObjectType;
    });

    if (!isKeyValueLine) {
      parent[line] = undefined;
      stack.push(line);
      continue;
    }

    const key = line.slice(0, spreaderIndex).trim();
    const value = line.slice(spreaderIndex + 1).trim();

    if (!value) {
      stack.push(key);
    }

    (parent as ObjectType)[key] = parseValue({ value });
  }

  return result;
};

type GetLineIndentArgs = {
  line: string;
};

const getLineIndent = ({ line }: GetLineIndentArgs) => {
  return line.search(/\S|$/) / 2;
};

type GetCompleteListItemArgs = {
  lines: string[];
  index: number;
  indent: number;
};

const getCompleteListItem = ({ lines, index, indent }: GetCompleteListItemArgs) => {
  const isKeyValueItem = isKeyValue({ line: lines[index] });
  if (!isKeyValueItem.isKeyValueLine) {
    let listItem = lines[index].trim();
    if (listItem.startsWith("- ")) {
      listItem = listItem.slice(2);
    }

    return { listItem, index };
  }

  const completeListItem: ObjectType = {};

  let multiLineKey = "";

  for (let i = index; i < lines.length; i++) {
    const line = lines[i];

    if (i > index && line.trim().startsWith("- ")) {
      return {
        listItem: isEmptyObject({ obj: completeListItem }) ? undefined : completeListItem,
        index: i - 1,
      };
    }

    const lineIndent = getLineIndent({ line });
    if (lineIndent < indent) {
      return {
        listItem: isEmptyObject({ obj: completeListItem }) ? undefined : completeListItem,
        index: i - 1,
      };
    }

    if (multiLineKey) {
      if (completeListItem[multiLineKey] === "|") {
        completeListItem[multiLineKey] = line.trim();
      } else {
        completeListItem[multiLineKey] += "\n" + line.trim();
      }
      continue;
    }

    const { isKeyValueLine, spreaderIndex } = isKeyValue({ line });
    if (!isKeyValueLine) {
      return {
        listItem: isEmptyObject({ obj: completeListItem }) ? undefined : completeListItem,
        index: i - 1,
      };
    }

    let key = line.slice(0, spreaderIndex).trim();
    const value = line.slice(spreaderIndex + 1);

    if (key.startsWith("- ")) {
      key = key.slice(2);
    }

    if (value === " |") {
      multiLineKey = key;
    }

    completeListItem[key] = value.trim();
  }

  return {
    listItem: isEmptyObject({ obj: completeListItem }) ? undefined : completeListItem,
    index: lines.length,
  };
};

type ParseValueArgs = {
  value: string;
};

const parseValue = ({ value }: ParseValueArgs): unknown => {
  if (value === "") {
    return undefined;
  }

  if (value === "null") {
    return null;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (!isNaN(Number(value))) {
    return Number(value);
  }
  return value;
};

type IsEmptyObjectArgs = {
  obj: ObjectType;
};

const isEmptyObject = ({ obj }: IsEmptyObjectArgs) => {
  const keys = Object.keys(obj);

  return keys.length === 0;
};

type IsKeyValueArgs = {
  line: string;
};

type StringQuotesHelperArgs = {
  expectedChar: string;
  stringQuotes: string[];
};

export const isKeyValue = ({ line }: IsKeyValueArgs) => {
  if (!line.includes(":")) {
    return { isKeyValueLine: false, spreaderIndex: -1 };
  }

  const stringQuotes: string[] = [];

  const stringQuotesHelper = ({ expectedChar, stringQuotes }: StringQuotesHelperArgs) => {
    if (stringQuotes[stringQuotes.length - 1] === expectedChar) {
      stringQuotes.pop();
    } else {
      stringQuotes.push(expectedChar);
    }
  };

  for (let i = 0; i < line.length; i++) {
    const currentChar = line[i];
    if (currentChar === '"') {
      stringQuotesHelper({ expectedChar: '"', stringQuotes });
    } else if (currentChar === "'") {
      stringQuotesHelper({ expectedChar: "'", stringQuotes });
    } else if (currentChar === "`") {
      stringQuotesHelper({ expectedChar: "`", stringQuotes });
    } else if (currentChar === ":" && stringQuotes.length === 0) {
      return { isKeyValueLine: true, spreaderIndex: i };
    }
  }

  return { isKeyValueLine: false, spreaderIndex: -1 };
};
