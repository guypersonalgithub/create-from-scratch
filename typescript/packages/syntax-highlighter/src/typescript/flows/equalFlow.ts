import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";

type EqualFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const equalFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
}: EqualFlowArgs) => {
  if (newTokenValue !== "=") {
    return;
  }

  if (
    previousTokensSummary.length > 0 &&
    previousTokensSummary[previousTokensSummary.length - 1] === TokenTypes.INVOKED_FUNCTION
  ) {
    return {
      updatedIndex: currentIndex - newTokenValue.length,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.OPERATOR, value: newTokenValue });

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
