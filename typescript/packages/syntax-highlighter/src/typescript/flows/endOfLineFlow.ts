import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";

type EndOfLineFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const endOfLineFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
}: EndOfLineFlowArgs) => {
  const firstChar = newTokenValue.charAt(0);
  if (firstChar !== ";") {
    return;
  }

  tokens.push({
    type: TokenTypes.END_OF_LINE,
    value: newTokenValue,
  });

  previousTokensSummary.push(TokenTypes.END_OF_LINE);

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
