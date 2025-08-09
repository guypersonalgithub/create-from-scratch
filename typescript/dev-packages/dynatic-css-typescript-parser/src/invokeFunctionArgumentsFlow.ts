import type { Callback, DynaticStyleChunksVariable } from "./types";
import { findNextBreakpoint } from "./utils";
import { valueFlow } from "./valueFlow";

type InvokeFunctionArgumentsFlowArgs = Pick<Callback, "input" | "currentIndex" | "newTokenValue">;

export const invokeFunctionArgumentsFlow = ({
  input,
  currentIndex,
  newTokenValue,
}: InvokeFunctionArgumentsFlowArgs) => {
  if (newTokenValue !== "(") {
    return { updatedIndex: currentIndex };
  }

  let completeValue = newTokenValue;
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
      currentIndex,
      newTokenValue: breakpoint.newTokenValue,
    });

    if (value) {
      if (name && type) {
        variables.push({ name, startIndex: start, endIndex: updatedIndex, type });
      }
      if (nestedVariables) {
        variables.push(...nestedVariables);
      }

      completeValue += value;
      currentIndex = updatedIndex;
    } else if (breakpoint.newTokenValue === ")") {
      completeValue += breakpoint.newTokenValue;
      break;
    } else {
      completeValue += breakpoint.newTokenValue;
    }
  }

  return { value: completeValue, updatedIndex: currentIndex, variables };
};
