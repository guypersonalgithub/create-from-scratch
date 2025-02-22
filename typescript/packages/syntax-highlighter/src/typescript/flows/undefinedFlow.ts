import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";

type UndefinedFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const undefinedFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
}: UndefinedFlowArgs) => {
  if (newTokenValue !== "undefined") {
    return;
  }

  tokens.push({
    type: TokenTypes.UNDEFINED,
    value: newTokenValue,
  });

  previousTokensSummary.push(TokenTypes.UNDEFINED);

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
