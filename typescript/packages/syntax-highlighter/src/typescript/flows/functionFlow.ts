import { TokenTypeOptions, TokenTypes } from "../constants";
import { nameFlow } from "../nameFlow";
import { BaseToken } from "../types";
import { angleFlow } from "./angleFlow";
import { parenthesisFlow } from "./parenthesisFlow";
import { spaceFollowUpFlow } from "./spaceFlow";

type FunctionFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedFunctions: string[];
};

export const functionFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedFunctions,
}: FunctionFlowArgs) => {
  if (newTokenValue !== "function") {
    return;
  }

  tokens.push({ type: TokenTypes.FUNCTION, value: newTokenValue });

  const { breakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const expectedName = nameFlow(breakpoint);
  if (expectedName.stop) {
    return expectedName;
  }

  tokens.push({ type: TokenTypes.FUNCTION_NAME, value: breakpoint.newTokenValue });

  const { breakpoint: followUp } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: breakpoint.currentIndex,
    previousTokensSummary,
  });

  const functionContinuation =
    angleFlow({
      tokens,
      input,
      previousTokensSummary,
      openedFunctions,
      isFromDefinitionFlow: true,
      isExpectedToBeType: true,
      ...followUp,
    }) ||
    parenthesisFlow({
      tokens,
      input,
      previousTokensSummary,
      openedFunctions,
      isFromDefinitionFlow: true,
      expectingFunction: true,
      ...followUp,
    });

  if (!functionContinuation) {
    return {
      updatedIndex: followUp.currentIndex,
      stop: true,
    };
  }

  if (functionContinuation.stop) {
    return {
      updatedIndex: functionContinuation.updatedIndex,
      stop: true,
    };
  }

  openedFunctions.push(breakpoint.newTokenValue);

  return {
    updatedIndex: functionContinuation.updatedIndex,
    stop: false,
  };
};
