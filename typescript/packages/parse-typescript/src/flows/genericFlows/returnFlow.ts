import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";

type ReturnFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const returnFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
}: ReturnFlowArgs) => {
  if (newTokenValue !== "return") {
    return;
  }

  tokens.push({
    type: TokenTypes.RETURN,
    value: newTokenValue,
  });

  previousTokensSummary.push(TokenTypes.RETURN);

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
