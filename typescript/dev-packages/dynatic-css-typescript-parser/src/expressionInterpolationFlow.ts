import type { DynaticStyleChunksVariable } from "./types";
import { findNextBreakpoint } from "./utils";
import { valueFlow } from "./valueFlow";

type ExpressionInterpolationFlowArgs = {
  input: string;
  currentIndex: number;
  newTokenValue: string;
  calledFromTemplateLiteral?: boolean;
};

export const expressionInterpolationFlow = ({
  input,
  currentIndex,
  newTokenValue,
  calledFromTemplateLiteral,
}: ExpressionInterpolationFlowArgs) => {
  if (newTokenValue !== "{") {
    return { updatedIndex: currentIndex };
  }

  let completeValue = newTokenValue;
  let startIndex = currentIndex - 1;
  let endIndex = currentIndex;
  let iterations = 0;
  const variables: DynaticStyleChunksVariable[] = [];

  while (currentIndex < input.length) {
    const breakpoint = findNextBreakpoint({ input, currentIndex });
    let start = currentIndex;
    currentIndex = breakpoint.updatedIndex;

    const {
      updatedIndex,
      value,
      name,
      type,
      variables: nestedVariables,
    } = valueFlow({
      input,
      currentIndex: breakpoint.updatedIndex,
      newTokenValue: breakpoint.newTokenValue,
    });

    if (value) {
      iterations++;

      if (name && type) {
        variables.push({ name, startIndex: start, endIndex: updatedIndex, type });
      }
      if (nestedVariables) {
        variables.push(...nestedVariables);
      }

      completeValue += value;
      currentIndex = updatedIndex;
    } else if (breakpoint.newTokenValue === "}") {
      completeValue += breakpoint.newTokenValue;
      endIndex = currentIndex;
      break;
    } else {
      completeValue += breakpoint.newTokenValue;
    }
  }

  if (iterations === 1 && variables.length === 1) {
    variables[0].startIndex = calledFromTemplateLiteral ? startIndex - 1 : startIndex;
    variables[0].endIndex = endIndex;
  }

  return { value: completeValue, updatedIndex: currentIndex, variables };
};
