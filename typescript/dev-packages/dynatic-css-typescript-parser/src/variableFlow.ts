import { invokeFunctionArgumentsFlow } from "./invokeFunctionArgumentsFlow";
import type { Callback, DynaticStyleChunksVariable } from "./types";
import { findNextBreakpoint, isntVariableName } from "./utils";

type VariableFlowArgs = Pick<Callback, "input" | "currentIndex" | "newTokenValue">;

type ReturnType =
  | {
      updatedIndex: number;
      value?: never;
      name?: never;
      type?: never;
      variables?: never;
    }
  | {
      updatedIndex: number;
      value: string;
      name: string;
      type: "function";
      variables: DynaticStyleChunksVariable[];
    }
  | {
      updatedIndex: number;
      value: string;
      name: string;
      type: "variable";
      variables?: never;
    };

export const variableFlow = ({
  input,
  currentIndex,
  newTokenValue,
}: VariableFlowArgs): ReturnType => {
  if (isntVariableName({ firstChar: newTokenValue })) {
    return { updatedIndex: currentIndex };
  }

  let completeValue = newTokenValue;

  const followup = findNextBreakpoint({ input, currentIndex });
  const func = invokeFunctionArgumentsFlow({
    input,
    currentIndex: followup.updatedIndex,
    newTokenValue: followup.newTokenValue,
  });

  if (func.value) {
    currentIndex = func.updatedIndex;
    completeValue += func.value;

    return {
      updatedIndex: currentIndex,
      value: completeValue,
      name: newTokenValue,
      type: "function",
      variables: func.variables,
    };
  }

  return {
    updatedIndex: currentIndex,
    value: completeValue,
    name: newTokenValue,
    type: "variable",
  };
};
