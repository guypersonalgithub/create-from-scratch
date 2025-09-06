import type { DynaticConfiguration } from "@packages/dynatic-css";
import type { Contexts, DynaticStyleChunksVariable } from "@packages/dynatic-css-typescript-parser";
import { replaceSubstring } from "@packages/utils";
import { stripQuotationMarks } from "./stripQuotationMarks";
import { isStatic } from "./isStatic";
import { getVariableValue } from "./getVariableValue";

type ParseCSSArgs = {
  css: string;
  context: string;
  variables: DynaticStyleChunksVariable[];
  contexts: Contexts;
  updatedConfig: DynaticConfiguration;
};

export const parseCSS = ({ css, context, variables, contexts, updatedConfig }: ParseCSSArgs) => {
  variables = variables.sort((var1, var2) => var1.startIndex - var2.startIndex);

  const split: {
    value: string;
    isRowStatic: boolean;
    pseudoClass?: string;
    mediaQuery?: string;
  }[] = [];
  let currentRow = "";
  const splitContext = context.split("-");

  let isRowStatic = true;
  let mediaQuery: { value: string; isStatic: boolean } | undefined = undefined;
  let pseudoClass: { value: string; isStatic: boolean } | undefined = undefined;

  let currentVariableIndex = 0;

  for (let i = 0; i < css.length; i++) {
    if (currentVariableIndex < variables.length) {
      const currentVariable = variables[currentVariableIndex];
      if (currentVariable.startIndex === i) {
        const { name, endIndex } = currentVariable;

        if (currentVariable.type === "variable") {
          // TODO: Also do that for nested contexts.
          const currentContext = splitContext.join("-");

          const contextVariables = contexts[currentContext];
          if (contextVariables) {
            const variable = contextVariables[name];
            if (variable && variable.type === "string") {
              const { value } = variable;
              const strippedValue = stripQuotationMarks({ str: value });

              currentRow += strippedValue;
              i = endIndex;
            } else {
              isRowStatic = false;
              currentVariableIndex++;
            }
          }

          currentVariableIndex++;
        } else if (currentVariable.type === "arrow-function-without-content") {
          let original = currentVariable.name;

          for (let j = currentVariableIndex + 1; j < variables.length; j++) {
            const currentNestedVariable = variables[j];
            currentVariableIndex = j;

            if (currentVariable.endIndex < currentNestedVariable.endIndex) {
              break;
            }

            const actualStart = currentVariable.startIndex;
            const startIndex = currentNestedVariable.startIndex - actualStart;
            const endIndex = currentNestedVariable.endIndex - actualStart;

            const value = getVariableValue({ variable: currentNestedVariable, updatedConfig });
            if (value !== undefined) {
              original = replaceSubstring({
                str: original,
                from: startIndex - 2,
                to: endIndex - 2,
                newStr: value,
              });
            }
          }

          const returnIndex = original.indexOf("=>");
          let returnValue = cleanCurrentRow({ currentRow: original.slice(returnIndex + 2) });

          if (returnValue.indexOf("${") === -1) {
            if (returnValue[0] === "`" && returnValue[returnValue.length - 1] === "`") {
              returnValue = returnValue.slice(1, returnValue.length - 1);
            }
          } else {
            isRowStatic = false;
            currentVariableIndex++;
          }

          currentRow += returnValue;
          i = endIndex;
        } else if (currentVariable.type === "multi-step-variable") {
          isRowStatic = false;
          currentVariableIndex++;
        } else if (currentVariable.type === "nested-variable") {
          const { name } = currentVariable;
          const strippedValue = stripQuotationMarks({ str: name });

          currentRow += strippedValue;
          i = endIndex;

          currentVariableIndex++;
        } else {
          const { startIndex } = currentVariable;
          currentVariableIndex++;
          isRowStatic = false;
          currentRow += css.slice(startIndex, endIndex);
          i = endIndex;
        }
      }
    }

    const current = css[i];

    if (current === "`") {
      continue;
    } else if (current === "\n") {
      const value = cleanCurrentRow({ currentRow });
      const isCurrentRowStatic = isStatic({ isRowStatic, mediaQuery, pseudoClass });

      if (value) {
        split.push({
          value,
          isRowStatic: isCurrentRowStatic,
          pseudoClass: pseudoClass?.value,
          mediaQuery: mediaQuery?.value,
        });
      }

      currentRow = "";
      isRowStatic = true;
    } else if (current === "{") {
      const trimmed = cleanCurrentRow({ currentRow });

      if (trimmed.startsWith("@media")) {
        if (!pseudoClass) {
          mediaQuery = {
            isStatic: isRowStatic,
            value: trimmed,
          };
        }

        currentRow = "";
        isRowStatic = true;
        continue;
      }

      const pseudoClassIndex = trimmed.indexOf(":");
      if (pseudoClassIndex === -1) {
        currentRow = "";
        isRowStatic = true;
        continue;
      }

      const originalClass = trimmed.slice(0, pseudoClassIndex);

      if (originalClass !== "&") {
        currentRow = "";
        isRowStatic = true;
        continue;
      }

      pseudoClass = {
        isStatic: isRowStatic,
        value: trimmed.slice(pseudoClassIndex),
      };
      currentRow = "";
      isRowStatic = true;
    } else if (current === "}") {
      currentRow = "";
      isRowStatic = true;
      if (pseudoClass) {
        pseudoClass = undefined;
      } else {
        mediaQuery = undefined;
      }
    } else if (current === ";") {
      continue;
    } else {
      currentRow += current;
    }
  }

  const trimmed = cleanCurrentRow({ currentRow });

  if (trimmed.length > 0) {
    const isCurrentRowStatic = isStatic({ isRowStatic, mediaQuery, pseudoClass });

    split.push({
      value: trimmed,
      isRowStatic: isCurrentRowStatic,
      pseudoClass: pseudoClass?.value,
      mediaQuery: mediaQuery?.value,
    });
  }

  return split;
};

type CleanCurrentRowArgs = {
  currentRow: string;
};

const cleanCurrentRow = ({ currentRow }: CleanCurrentRowArgs) =>
  currentRow.replaceAll("\n", "").trim();
