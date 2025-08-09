import type { Callback, DynaticStyleChunksVariable } from "./types";
import { spaceCallback } from "./utils";

type ArrowFunctionFlowArgs = Pick<Callback, "input" | "currentIndex" | "newTokenValue">;

export const arrowFunctionFlow = ({
  input,
  currentIndex,
  newTokenValue,
}: ArrowFunctionFlowArgs) => {
  let parenthesisCount = 1;

  const startIndex = currentIndex - newTokenValue.length;

  let fullValue = newTokenValue;

  let next = spaceCallback({ input, currentIndex });

  const variables: DynaticStyleChunksVariable[] = [];

  if (next.newTokenValue === ")") {
    if (next.skipped) {
      fullValue += next.skipped;
    }
    fullValue += next.newTokenValue;
    parenthesisCount--;
  }

  while (parenthesisCount > 0 && next.updatedIndex < input.length) {
    next = spaceCallback({ input, currentIndex: next.updatedIndex });
    if (next.skipped) {
      fullValue += next.skipped;
    }
    fullValue += next.newTokenValue;

    if (next.newTokenValue === "(") {
      parenthesisCount++;
    } else if (next.newTokenValue === ")") {
      parenthesisCount--;
    }
  }

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

  if (next.newTokenValue === "=" && input[next.updatedIndex] === ">") {
    fullValue += input[next.updatedIndex];
    next = spaceCallback({ input, currentIndex: next.updatedIndex + 1 });
    if (next.skipped) {
      fullValue += next.skipped;
    }
    fullValue += next.newTokenValue;
    if (next.newTokenValue === "{") {
      next = spaceCallback({ input, currentIndex: next.updatedIndex });

      while (next.updatedIndex < input.length && next.newTokenValue !== "}") {
        next = spaceCallback({ input, currentIndex: next.updatedIndex });
        if (next.skipped) {
          fullValue += next.skipped;
        }
        fullValue += next.newTokenValue;
      }

      variables.push({
        type: "function",
        name: fullValue,
        startIndex: currentIndex,
        endIndex: next.updatedIndex,
      });

      return { updatedIndex: next.updatedIndex, value: fullValue, variables };
    } else {
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
        type: "arrow-function-without-content",
        name: fullValue,
        startIndex,
        endIndex: next.updatedIndex,
      });

      return { updatedIndex: next.updatedIndex, value: fullValue, variables };
    }
  }

  return { updatedIndex: next.updatedIndex };
};
