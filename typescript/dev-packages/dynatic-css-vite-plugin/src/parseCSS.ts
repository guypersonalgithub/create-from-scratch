import type { Contexts, DynaticStyleChunksVariable } from "@packages/dynatic-css-typescript-parser";

type ParseCSSArgs = {
  css: string;
  context: string;
  variables: DynaticStyleChunksVariable[];
  contexts: Contexts;
};

export const parseCSS = ({ css, context, variables, contexts }: ParseCSSArgs) => {
  variables = variables.sort((var1, var2) => var1.endIndex - var2.endIndex);

  const split: { value: string; isRowStatic: boolean }[] = [];
  let currentRow = "";
  const splitContext = context.split("-");

  let isRowStatic = true;

  for (let i = 0; i < css.length; i++) {
    if (variables.length > 0) {
      const lastVariable = variables[variables.length - 1];
      if (lastVariable.startIndex === i) {
        const { name, endIndex } = lastVariable;

        if (lastVariable.type === "variable") {
          // TODO: Also do that for nested contexts.
          const currentContext = splitContext.join("-");

          const contextVariables = contexts[currentContext];
          if (contextVariables) {
            const variable = contextVariables[name];
            if (variable && variable.type === "string") {
              const { value } = variable;
              let strippedValue = value;
              if (
                (strippedValue[0] === "'" && strippedValue[strippedValue.length - 1] === "'") ||
                (strippedValue[0] === '"' && strippedValue[strippedValue.length - 1] === '"')
              ) {
                strippedValue = strippedValue.slice(1, strippedValue.length - 1);
              }

              currentRow += strippedValue;
              i = endIndex;
            } else {
              isRowStatic = false;
            }
          }

          if (variables.length > 0) {
            variables.pop();
          }
        } else {
          const { startIndex } = lastVariable;
          isRowStatic = false;
          currentRow += css.slice(startIndex, endIndex);
          i = endIndex;
        }
      }
    }

    const current = css[i];
    if (current === "`") {
      continue;
    } else if (current === ";") {
      split.push({ value: currentRow.replaceAll("\n", "").trim(), isRowStatic });
      currentRow = "";
      isRowStatic = true;
    } else {
      currentRow += current;
    }
  }

  if (currentRow.length > 0) {
    split.push({ value: currentRow.replaceAll("\n", "").trim(), isRowStatic });
  }

  return split;
};
