import { expressionInterpolationFlow } from "./expressionInterpolationFlow";
import type { Callback, DynaticStyleChunksVariable } from "./types";

type TemplateLiteralFlow = Pick<
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
>;

export const templateLiteralFlow = ({
  input,
  currentIndex,
  newTokenValue,
  identifier,
  dynaticStyleChunks,
  dynaticStyleOrderedChunks,
  nameslessStyleOrderedChunks,
  uniqueImports,
  openContexts,
}: TemplateLiteralFlow) => {
  if (!newTokenValue || newTokenValue !== "`") {
    return { updatedIndex: currentIndex };
  }

  let completeValue = newTokenValue;
  const variables: DynaticStyleChunksVariable[] = [];

  // TODO: this runs twice when it isn't intended to on certain scenarios, remember to debug and fix.

  while (currentIndex < input.length) {
    const current = input[currentIndex];
    if (current === "/") {
      const followup = input[currentIndex + 1];
      if (followup === "/") {
        currentIndex += 2;

        let newCurrent = input[currentIndex];
        while (newCurrent !== "\n" && currentIndex < input.length) {
          currentIndex++;
          newCurrent = input[currentIndex];
        }

        if (newCurrent === "\n") {
          currentIndex++;
        }

        continue;
      } else if (followup === "*") {
        currentIndex += 2;

        let newCurrent = input[currentIndex];
        while (
          currentIndex < input.length &&
          !(newCurrent === "*" && input[currentIndex + 1] === "/")
        ) {
          currentIndex++;
          newCurrent = input[currentIndex];
        }

        if (newCurrent === "*" && input[currentIndex + 1] === "/") {
          currentIndex += 2;
        }

        continue;
      }
    }

    completeValue += current;
    currentIndex++;

    if (current === "$") {
      const followingCharacter = input[currentIndex];
      const expressionInterpolation = expressionInterpolationFlow({
        input,
        currentIndex: currentIndex + 1,
        newTokenValue: followingCharacter,
        calledFromTemplateLiteral: true,
        identifier,
        dynaticStyleChunks,
        dynaticStyleOrderedChunks,
        nameslessStyleOrderedChunks,
        uniqueImports,
        openContexts,
      });

      if (expressionInterpolation.value) {
        let startIndex = currentIndex - 1;

        completeValue += expressionInterpolation.value;
        currentIndex = expressionInterpolation.updatedIndex;

        if (expressionInterpolation.variables) {
          const interpolationVariables = expressionInterpolation.variables;
          if (interpolationVariables.length > 0) {
            variables.push(...interpolationVariables);
          } else {
            const value = expressionInterpolation.value;
            const name = value.slice(1, value.length - 1);

            variables.push({
              startIndex,
              endIndex: expressionInterpolation.updatedIndex,
              type: "nested-variable",
              name,
            });
          }
        }

        continue;
      }
    } else if (current === "`") {
      break;
    }
  }

  return { value: completeValue, updatedIndex: currentIndex, variables };
};
