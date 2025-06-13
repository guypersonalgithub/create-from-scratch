import { type TokenTypeOptions } from "../../constants";
import { type BaseToken, type OpenedContext } from "../../types";
import { angleFlow } from "../angleFlow";
import { parenthesisFlow } from "../parenthesisFlows";
import { spaceFollowUpFlow } from "../genericFlows";
import { nestedContextFlow } from "../nestedContextFlow";

type PartialFunctionFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
  functionName: string;
};

export const partialFunctionFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  functionName,
}: PartialFunctionFlowArgs) => {
  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const functionContinuation =
    angleFlow({
      tokens,
      input,
      previousTokensSummary,
      openedContexts,
      isFromDefinitionFlow: true,
      isExpectedToBeType: true,
      ...breakpoint,
    }) ||
    parenthesisFlow({
      tokens,
      input,
      previousTokensSummary,
      openedContexts,
      isFromDefinitionFlow: true,
      expectedToBeAFunction: true,
      ...breakpoint,
    });

  if (!functionContinuation) {
    return {
      updatedIndex: space?.updatedIndex ?? currentIndex,
      stop: true,
    };
  }

  if (functionContinuation.stop) {
    return {
      updatedIndex: functionContinuation.updatedIndex,
      stop: true,
    };
  }

  openedContexts.push({ name: functionName, type: "function" });

  return nestedContextFlow({
    tokens,
    input,
    currentIndex: functionContinuation.updatedIndex,
    previousTokensSummary,
    openedContexts,
  });
};
