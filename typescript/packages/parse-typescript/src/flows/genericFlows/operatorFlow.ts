import { operators, TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";

type OperatorFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const operatorFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
}: OperatorFlowArgs) => {
  if (!operators.has(newTokenValue)) {
    return;
  }

  tokens.push({
    type: TokenTypes.OPERATOR,
    value: newTokenValue,
  });

  previousTokensSummary.push(TokenTypes.OPERATOR);

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
