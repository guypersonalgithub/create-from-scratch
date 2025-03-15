import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken, OpenedContext } from "../../types";

type CloseFunctionFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const closeFunctionFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: CloseFunctionFlowArgs) => {
  if (newTokenValue !== "}" || openedContexts.length === 0) {
    return;
  }

  tokens.push({ type: TokenTypes.FUNCTION_CURLY_BRACKET, value: newTokenValue });
  previousTokensSummary.push(TokenTypes.FUNCTION_CURLY_BRACKET);
  openedContexts.pop();

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
