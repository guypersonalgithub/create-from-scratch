import { parseTypescript } from "@packages/parse-typescript";
import { removeWrapperQuotationMarks } from "@packages/string-utils";

type ConvertStringToObjectWithStringPropertiesArgs = {
  str: string;
  removeKeyQuotations?: boolean;
  removeValueQuotations?: boolean;
  returnObjectOnIncorrectToken?: boolean;
  skipLog?: boolean;
};

export type ParsedObject =
  | {
      [key: string]: string | (string | ParsedObject)[] | ParsedObject;
    }
  | (string | ParsedObject)[];

export const convertStringToObjectWithStringProperties = ({
  str,
  removeKeyQuotations,
  removeValueQuotations,
  returnObjectOnIncorrectToken,
  skipLog,
}: ConvertStringToObjectWithStringPropertiesArgs) => {
  const tokens = parseTypescript({ input: str, skipLog });
  const tokensCopy = tokens.slice();
  const object: ParsedObject = {};

  try {
    while (tokensCopy.length > 0) {
      const current = tokensCopy.shift();
      if (!current) {
        break;
      }

      if (current.type === "object-curly-bracket" && current.value === "{") {
        const nestedObject = parseNestedObject({
          tokens: tokensCopy,
          removeKeyQuotations,
          removeValueQuotations,
          returnObjectOnIncorrectToken,
        });
        if (nestedObject) {
          for (const key in nestedObject) {
            const value = nestedObject[key];
            object[key] = value;
          }
        }
      } else if (current.type === "array-square-bracket" && current.value === "[") {
        const array = parseNestedArray({
          tokens,
          removeKeyQuotations,
          removeValueQuotations,
          returnObjectOnIncorrectToken,
        });
        if (array) {
          const key = removeKeyQuotations
            ? removeWrapperQuotationMarks({ str: current.value })
            : current.value;
          object[key] = array;
        }
      } else {
        // console.log(current);
      }
    }
  } catch (error) {
    console.error(error);
  }

  return { object };
};

type ParseNestedObjectArgs = {
  tokens: ReturnType<typeof parseTypescript>;
  removeKeyQuotations?: boolean;
  removeValueQuotations?: boolean;
  returnObjectOnIncorrectToken?: boolean;
};

const parseNestedObject = ({
  tokens,
  removeKeyQuotations,
  removeValueQuotations,
  returnObjectOnIncorrectToken,
}: ParseNestedObjectArgs) => {
  const object: ParsedObject = {};

  tokens.shift();
  while (tokens.length > 0) {
    const current = tokens.shift();
    if (!current) {
      return;
    }

    if (current.type === "object-property" || current.type === "object-string-property") {
      let next = tokens.shift();
      if (!next) {
        return;
      }

      if (next.type === "whitespace") {
        next = tokens.shift();
        if (!next) {
          return;
        }
      }

      if (next.type === "object-colon") {
        let value = tokens.shift();
        if (!value) {
          return;
        }
        if (value.type === "whitespace") {
          value = tokens.shift();
          if (!value) {
            return;
          }

          const key = removeKeyQuotations
            ? removeWrapperQuotationMarks({ str: current.value })
            : current.value;

          if (value.type !== "object-curly-bracket") {
            if (value.type === "array-square-bracket" && value.value === "[") {
              const array = parseNestedArray({
                tokens,
                removeKeyQuotations,
                removeValueQuotations,
                returnObjectOnIncorrectToken,
              });
              if (array) {
                object[key] = array;
              }
            } else if (value.type === "string" || value.type === "number") {
              const parsedValue = removeValueQuotations
                ? removeWrapperQuotationMarks({ str: value.value })
                : value.value;
              object[key] = parsedValue;
            } else {
              const parsedValue = removeValueQuotations
                ? removeWrapperQuotationMarks({ str: value.value })
                : value.value;
              let fullValue = parsedValue;
              let following: (typeof tokens)[number] | undefined;
              const parenthesis = [];
              while (tokens.length > 0 && (following = tokens.shift())) {
                if (following?.type === "object-curly-bracket" && following.value === "{") {
                  const nested = parseNestedObject({
                    tokens,
                    removeKeyQuotations,
                    removeValueQuotations,
                    returnObjectOnIncorrectToken,
                  });
                  if (nested) {
                    fullValue += nested;
                  }
                } else if (
                  ((following?.type === "object-curly-bracket" && following.value === "}") ||
                    (following.type === "comma" && following.value === ",") ||
                    following.type === "object-property" ||
                    following.type === "object-string-property") &&
                  parenthesis.length === 0
                ) {
                  break;
                } else if (following.type === "array-square-bracket" && following.value === "[") {
                  const array = parseNestedArray({
                    tokens,
                    removeKeyQuotations,
                    removeValueQuotations,
                    returnObjectOnIncorrectToken,
                  });
                  if (array) {
                    fullValue += array;
                  }
                } else if (following.type === "parenthesis" && following.value === "(") {
                  fullValue += following.value;
                  parenthesis.push("(");
                } else if (following.type === "parenthesis" && following.value === ")") {
                  fullValue += following.value;
                  parenthesis.pop();
                } else {
                  // const parsedValue = removeValueQuotations
                  //   ? removeWrapperQuotationMarks({ str: following.value })
                  //   : following.value;
                  fullValue += following.value;
                }
              }

              object[key] = fullValue;
            }
          } else {
            const nested = parseNestedObject({
              tokens,
              removeKeyQuotations,
              removeValueQuotations,
              returnObjectOnIncorrectToken,
            });
            if (nested) {
              object[key] = nested;
            }
          }
        }
      } else {
        if (returnObjectOnIncorrectToken) {
          return object;
        }

        return;
      }
    } else if (current.type === "object-curly-bracket" && current.value === "}") {
      return object;
    }
  }

  return object;
};

type ParseNestedArrayArgs = {
  tokens: ReturnType<typeof parseTypescript>;
  removeKeyQuotations?: boolean;
  removeValueQuotations?: boolean;
  returnObjectOnIncorrectToken?: boolean;
};

const parseNestedArray = ({
  tokens,
  removeKeyQuotations,
  removeValueQuotations,
  returnObjectOnIncorrectToken,
}: ParseNestedArrayArgs) => {
  const array: (ParsedObject | string)[] = [];

  while (tokens.length > 0) {
    const current = tokens.shift();
    if (!current) {
      return;
    }

    if (current.type === "object-curly-bracket" && current.value === "{") {
      const object = parseNestedObject({
        tokens,
        removeKeyQuotations,
        removeValueQuotations,
        returnObjectOnIncorrectToken,
      });
      if (object) {
        array.push(object);
      }
    } else if (current.type === "array-square-bracket" && current.value === "[") {
      const nestedArray = parseNestedArray({
        tokens,
        removeKeyQuotations,
        removeValueQuotations,
        returnObjectOnIncorrectToken,
      });
      if (nestedArray) {
        array.push(nestedArray);
      }
    } else if (current.type === "array-square-bracket" && current.value === "]") {
      return array;
    } else if (current.type === "string") {
      const value = removeValueQuotations
        ? removeWrapperQuotationMarks({ str: current.value })
        : current.value;
      array.push(value);
    } else if (current.type === "number") {
      array.push(current.value);
    } else if (
      current.type === "variable" ||
      current.type === "function-name" ||
      current.type === "invoked-function" ||
      current.type === "boolean"
    ) {
      const parsedValue = removeValueQuotations
        ? removeWrapperQuotationMarks({ str: current.value })
        : current.value;
      let fullValue = parsedValue;
      let following: (typeof tokens)[number] | undefined;
      while (tokens.length > 0 && (following = tokens.shift())) {
        if (following?.type === "object-curly-bracket" && following.value === "{") {
          const nested = parseNestedObject({
            tokens,
            removeKeyQuotations,
            removeValueQuotations,
            returnObjectOnIncorrectToken,
          });
          if (nested) {
            fullValue += nested;
          }
        } else if (
          following?.type === "array-square-bracket" &&
          following.value === "]"
          // ||
          // (following.type === "comma" && following.value === ",") ||
          // following.type === "object-property" ||
          // following.type === "object-string-property"
        ) {
          break;
        } else if (following.type === "array-square-bracket" && following.value === "[") {
          const array = parseNestedArray({
            tokens,
            removeKeyQuotations,
            removeValueQuotations,
            returnObjectOnIncorrectToken,
          });
          if (array) {
            fullValue += array;
          }
        } else {
          // const parsedValue = removeValueQuotations
          //   ? removeWrapperQuotationMarks({ str: following.value })
          //   : following.value;
          fullValue += following.value;
        }
      }

      array.push(fullValue);
      break;
    }
  }

  return array;
};
