import { TokenTypeOptions, TokenTypes } from "../../constants";
import { nameFlow } from "../../nameFlow";
import { BaseToken, OpenedContext } from "../../types";
import { angleFlow } from "../angleFlow";
import { parenthesisFlow } from "../parenthesisFlow";
import { spaceFollowUpFlow } from "../genericFlows";

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
      expectingFunction: true,
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

  return {
    updatedIndex: functionContinuation.updatedIndex,
    stop: false,
  };
};
