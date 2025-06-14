import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { nameFlow } from "../../nameFlow";
import { type BaseToken, type OpenedContext } from "../../types";
import { partialFunctionFlow } from "./partialFunctionFlow";
import { spaceFollowUpFlow } from "../genericFlows";

type FunctionFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const functionFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
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

  return partialFunctionFlow({
    tokens,
    input,
    currentIndex: breakpoint.currentIndex,
    previousTokensSummary,
    openedContexts,
    functionName: breakpoint.newTokenValue,
  });
};
