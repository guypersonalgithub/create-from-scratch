import { parseTypescript } from "@packages/parse-typescript";
import { removeWrapperQuotationMarks } from "@packages/utils";

type ConvertStringToObjectWithStringPropertiesArgs = {
  str: string;
  removeKeyQuotations?: boolean;
  removeValueQuotations?: boolean;
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
}: ConvertStringToObjectWithStringPropertiesArgs) => {
  const tokens = parseTypescript({ input: str });
  const tokensCopy = tokens.slice();
  const object: ParsedObject = {};

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

  // const object: ParsedObject = {};
  // const nestingKeys: string[] = [];
  // let arrayCell: ParsedObject = {};
  // const nestingArrayKeys: string[] = [];
  // let isWithinArray = false;
  // const first = tokens[0];
  // if (first.value !== "{") {
  //   return object;
  // }

  // for (let i = 1; i < 100; i++) {
  //   const current = tokens[i];
  //   const currentKeys = isWithinArray ? nestingArrayKeys : nestingKeys;
  //   const currentObject = isWithinArray ? arrayCell : object;
  //   if (current.type === "object-property" || current.type === "object-string-property") {
  //     currentKeys.push(current.value);
  //     i++;
  //     let next = tokens[i];

  //     if (next.type === "whitespace") {
  //       i++;
  //       next = tokens[i];
  //     }

  //     if (next.type === "object-colon") {
  //       i++;
  //       let value = tokens[i];
  //       if (value.type === "whitespace") {
  //         i++;
  //         value = tokens[i];

  //         if (value.type !== "object-curly-bracket") {
  //           if (value.type === "array-square-bracket") {
  //             isWithinArray = value.value === "[";
  //           } else {
  //             setNestedKey({
  //               obj: currentObject,
  //               keys: currentKeys,
  //               value: value.value,
  //               valueKey: current.value,
  //             });

  //             currentKeys.pop();
  //           }
  //         }
  //       }
  //     } else {
  //       throw "Unexpected syntax, expected object colon";
  //     }
  //   } else if (current.type === "object-curly-bracket" && current.value === "}") {
  //     if (isWithinArray) {
  //     }

  //     currentKeys.pop();
  //   }

  //   // setNestedKey({
  //   //   obj: object,
  //   //   keys: nestingKeys,
  //   // });
  // }

  // for (let i = 0; i < lines.length; i++) {
  //   const line = lines[i];
  //   const trimmed = line.trim();

  //   if (trimmed === "}" || trimmed === "},") {
  //     nestingKeys.pop();
  //     continue;
  //   }

  //   const keyValueMatch = trimmed.match(/^"?([~\w@./-]+)"?:\s*(.*?),?\s*$/);
  //   if (keyValueMatch) {
  //     currentKey = keyValueMatch[1].replace(/^"|"$/g, "");
  //     currentValue = keyValueMatch[2];
  //     isInValue = !keyValueMatch[0].endsWith(",") && !keyValueMatch[0].endsWith("{");
  //     if (keyValueMatch[0].endsWith("(")) {
  //       isInParenthesis = true;
  //     }

  //     if (currentValue === "{}") {
  //       if (currentKey) {
  //         nestingKeys.push(currentKey);
  //       }

  //       setNestedKey({
  //         obj: object,
  //         keys: nestingKeys,
  //       });

  //       if (currentKey) {
  //         nestingKeys.pop();
  //       }

  //       continue;
  //     }

  //     if (currentKey && currentValue !== "{" && !isInValue) {
  //       const trimmedValue = currentValue.trim();
  //       setNestedKey({
  //         obj: object,
  //         keys: nestingKeys,
  //         valueKey: currentKey,
  //         value: trimmedValue,
  //       });
  //     } else if (currentValue === "{") {
  //       nestingKeys.push(currentKey);
  //       currentValue = "";
  //     }
  //   } else if (isInValue || isInParenthesis) {
  //     currentValue += ` ${trimmed}`;
  //     if (trimmed.endsWith(",")) {
  //       if (trimmed[trimmed.length - 2] === ")") {
  //         isInParenthesis = false;
  //       }

  //       isInValue = false;
  //     } else if (trimmed.endsWith(")")) {
  //       isInParenthesis = false;
  //     }

  //     if (!isInValue && !isInParenthesis) {
  //       const trimmedValue = currentValue.trim();
  //       setNestedKey({
  //         obj: object,
  //         keys: nestingKeys,
  //         valueKey: currentKey,
  //         value: trimmedValue,
  //       });
  //     }
  //   }
  // }

  return { object };
};

type ParseNestedObjectArgs = {
  tokens: ReturnType<typeof parseTypescript>;
  removeKeyQuotations?: boolean;
  removeValueQuotations?: boolean;
};

const parseNestedObject = ({
  tokens,
  removeKeyQuotations,
  removeValueQuotations,
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
            });
            if (nested) {
              object[key] = nested;
            }
          }
        }
      } else {
        throw "Unexpected syntax, expected object colon";
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
};

const parseNestedArray = ({
  tokens,
  removeKeyQuotations,
  removeValueQuotations,
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
      });
      if (object) {
        array.push(object);
      }
    } else if (current.type === "array-square-bracket" && current.value === "[") {
      const nestedArray = parseNestedArray({
        tokens,
        removeKeyQuotations,
        removeValueQuotations,
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
