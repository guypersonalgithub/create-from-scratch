import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";

type CloseFunctionFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedFunctions: string[];
};

export const closeFunctionFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
  openedFunctions,
}: CloseFunctionFlowArgs) => {
  if (newTokenValue !== "}" || openedFunctions.length === 0) {
    return;
  }

  tokens.push({ type: TokenTypes.FUNCTION_CURLY_BRACKET, value: newTokenValue });
  previousTokensSummary.push(TokenTypes.FUNCTION_CURLY_BRACKET);
  openedFunctions.pop();

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
