import type {
  ArgumentTypes,
  Callback,
  DynaticStyleChunksVariable,
  RegularVariableTypes,
} from "./types";
import { spaceCallback } from "./utils";
import { valueFlow } from "./valueFlow";

type ArrowFunctionFlowArgs = Pick<
  Callback,
  | "input"
  | "currentIndex"
  | "newTokenValue"
  | "identifier"
  | "dynaticStyleChunks"
  | "dynaticStyleOrderedChunks"
  | "nameslessStyleOrderedChunks"
  | "uniqueImports"
  | "openContexts"
> & {
  calledFromTemplateLiteral?: boolean;
  calledFromStartOfExpression?: boolean;
};

export const arrowFunctionFlow = ({
  input,
  currentIndex,
  newTokenValue,
  calledFromTemplateLiteral,
  calledFromStartOfExpression,
  identifier,
  dynaticStyleChunks,
  dynaticStyleOrderedChunks,
  nameslessStyleOrderedChunks,
  uniqueImports,
  openContexts,
}: ArrowFunctionFlowArgs) => {
  let parenthesisCount = 1;

  let startIndex = currentIndex - newTokenValue.length;

  let fullValue = newTokenValue;

  let next = spaceCallback({ input, currentIndex });

  const variables: DynaticStyleChunksVariable[] = [];

  let argument = "";

  if (!calledFromStartOfExpression) {
    while (parenthesisCount > 0 && next.updatedIndex < input.length) {
      if (next.skipped) {
        fullValue += next.skipped;
      }
      fullValue += next.newTokenValue;

      if (next.newTokenValue === "(") {
        parenthesisCount++;
      } else if (next.newTokenValue === ")") {
        parenthesisCount--;

        if (parenthesisCount === 0) {
          break;
        }
      } else {
        argument += next.newTokenValue;
      }

      next = spaceCallback({ input, currentIndex: next.updatedIndex });
    }

    argument = argument.split(",")[0];

    while (
      next.updatedIndex < input.length && next.newTokenValue === "="
        ? input[next.updatedIndex] !== ">"
        : true && next.newTokenValue !== ";"
    ) {
      next = spaceCallback({ input, currentIndex: next.updatedIndex });
      if (next.skipped) {
        fullValue += next.skipped;
      }
      fullValue += next.newTokenValue;
    }
  } else {
    argument = newTokenValue;
    if (next.skipped) {
      fullValue += next.skipped;
    }
    fullValue += next.newTokenValue;
  }

  // checking for =>
  if (next.newTokenValue === "=" && input[next.updatedIndex] === ">") {
    fullValue += input[next.updatedIndex];
    next = spaceCallback({ input, currentIndex: next.updatedIndex + 1 });
    if (next.skipped) {
      fullValue += next.skipped;
    }

    if (next.newTokenValue === "{") {
      fullValue += next.newTokenValue;
      let curlyBrackets = 0;

      while (
        (next.updatedIndex < input.length && next.newTokenValue !== "}") ||
        (next.newTokenValue === "}" && curlyBrackets > 0)
      ) {
        const following = spaceCallback({ input, currentIndex: next.updatedIndex });

        if (following.newTokenValue === "{") {
          curlyBrackets++;
        } else if (following.newTokenValue === "}") {
          if (curlyBrackets === 0) {
            break;
          }

          curlyBrackets--;
        }

        fullValue += following.newTokenValue;
        next = following;
      }

      variables.push({
        type: "function",
        name: fullValue,
        startIndex: currentIndex,
        endIndex: next.updatedIndex,
        isWithinTemplateLiteral: calledFromTemplateLiteral,
      });

      return { updatedIndex: next.updatedIndex, value: fullValue, variables };
    } else {
      const value = valueFlow({
        input,
        currentIndex: next.updatedIndex,
        newTokenValue: next.newTokenValue,
        identifier,
        dynaticStyleChunks,
        dynaticStyleOrderedChunks,
        nameslessStyleOrderedChunks,
        uniqueImports,
        openContexts,
      });

      if (value.value) {
        fullValue += value.value;
      }

      let endIndex = value.updatedIndex;

      if (calledFromTemplateLiteral) {
        const before = input[startIndex - 1];

        if (before === "{") {
          const before2 = input[startIndex - 2];
          if (before2 === "$") {
            const after = input[endIndex];
            if (after === "}") {
              startIndex = startIndex - 2;
              endIndex = endIndex + 1;
            }
          }
        }
      }

      variables.push({
        type: "arrow-function-without-content",
        name: fullValue,
        startIndex,
        endIndex,
      });

      if (
        value.name &&
        value.type === "multi-step-function" &&
        value.name.startsWith(`${argument}.`)
      ) {
        const args: DynaticStyleChunksVariable["args"] = [];

        if (value.variables) {
          args.push(
            ...value.variables.map((variable) => {
              const isNested = variable.name.startsWith(`${argument}.`);

              if (isNested) {
                return {
                  ...variable,
                  type: "config-variable" as ArgumentTypes,
                };
              }

              return {
                ...variable,
                type: getMultiStepFunctionArgumentType({
                  input,
                  type: variable.type,
                  endIndex: variable.endIndex,
                }),
              };
            }),
          );
        }

        const startIndex = value.updatedIndex - value.name.length;
        const endIndex = value.updatedIndex;
        const variable = {
          name: value.name,
          startIndex,
          endIndex,
        };

        variables.push({
          ...variable,
          type: "multi-step-function",
          args,
        });
      } else {
        if (value.variables) {
          variables.push(
            ...value.variables.map((variable) => {
              const isNested = variable.name.startsWith(`${argument}.`);
              if (isNested) {
                const { name, startIndex, endIndex, isWithinTemplateLiteral } = variable;

                return {
                  name,
                  startIndex,
                  endIndex,
                  isWithinTemplateLiteral,
                  type: "config-variable" as RegularVariableTypes,
                };
              }

              return variable;
            }),
          );
        }

        if (value.name && value.type === "multi-step-variable") {
          const isNested = value.name.startsWith(`${argument}.`);
          const startIndex = value.updatedIndex - value.name.length;
          const endIndex = value.updatedIndex;
          const variable = {
            name: value.name,
            startIndex,
            endIndex,
          };

          if (isNested) {
            variables.push({
              ...variable,
              type: "config-variable" as RegularVariableTypes,
            });
          } else {
            variables.push({ ...variable, type: value.type });
          }
        }
      }

      return { updatedIndex: value.updatedIndex, value: fullValue, variables };
    }
  }

  return { updatedIndex: next.updatedIndex };
};

type GetMultiStepFunctionArgumentTypeArgs = {
  input: string;
  type: RegularVariableTypes | "multi-step-function";
  endIndex: number;
};

const getMultiStepFunctionArgumentType = ({
  input,
  type,
  endIndex,
}: GetMultiStepFunctionArgumentTypeArgs): ArgumentTypes => {
  if (type === "multi-step-variable") {
    return "value";
  }

  if (type === "multi-step-function-static-value") {
    return "static-value";
  }

  const next = spaceCallback({ input, currentIndex: endIndex });
  return next.newTokenValue === ":" ? "property" : "config-variable";
};
