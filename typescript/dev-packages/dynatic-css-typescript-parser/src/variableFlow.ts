import { invokeFunctionArgumentsFlow } from "./invokeFunctionArgumentsFlow";
import type { Callback, DynaticStyleChunksVariable } from "./types";
import { findNextBreakpoint, isntVariableName, spaceCallback } from "./utils";

type VariableFlowArgs = Pick<
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
      type: "variable" | "multi-step-variable";
      variables?: never;
    };

export const variableFlow = ({
  input,
  currentIndex,
  newTokenValue,
  identifier,
  dynaticStyleChunks,
  dynaticStyleOrderedChunks,
  nameslessStyleOrderedChunks,
  uniqueImports,
  openContexts,
}: VariableFlowArgs): ReturnType => {
  if (isntVariableName({ firstChar: newTokenValue })) {
    return { updatedIndex: currentIndex };
  }

  let completeValue = newTokenValue;

  // spaceCallback
  const followup = findNextBreakpoint({ input, currentIndex });
  const func = invokeFunctionArgumentsFlow({
    input,
    currentIndex: followup.updatedIndex,
    newTokenValue: followup.newTokenValue,
    identifier,
    dynaticStyleChunks,
    dynaticStyleOrderedChunks,
    nameslessStyleOrderedChunks,
    uniqueImports,
    openContexts,
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

  const multiStep = multiStepVaribleFlow({ input, currentIndex });

  if (multiStep.value) {
    completeValue += multiStep.value;

    return {
      updatedIndex: multiStep.updatedIndex,
      value: completeValue,
      name: completeValue,
      type: "multi-step-variable",
    };
  }

  return {
    updatedIndex: currentIndex,
    value: completeValue,
    name: newTokenValue,
    type: "variable",
  };
};

type MultiStepVariableFlowArgs = {
  input: string;
  currentIndex: number;
};

type MultiStepVariableFlowReturn = {
  updatedIndex: number;
  value?: string;
};

const multiStepVaribleFlow = ({
  input,
  currentIndex,
}: MultiStepVariableFlowArgs): MultiStepVariableFlowReturn => {
  const followup = spaceCallback({ input, currentIndex });

  if (followup.newTokenValue !== ".") {
    return { updatedIndex: followup.skipped ? followup.updatedIndex : currentIndex };
  }

  let value = (followup.skipped ?? "") + followup.newTokenValue;

  const next = spaceCallback({ input, currentIndex: followup.updatedIndex });
  if (isntVariableName({ firstChar: next.newTokenValue })) {
    return { updatedIndex: next.skipped ? next.updatedIndex : followup.updatedIndex };
  }

  value += next.newTokenValue;
  const furtherNesting = multiStepVaribleFlow({ input, currentIndex: next.updatedIndex });
  if (!furtherNesting?.value) {
    return { updatedIndex: next.updatedIndex, value };
  }

  value += furtherNesting.value;

  return { updatedIndex: furtherNesting.updatedIndex, value };
};
