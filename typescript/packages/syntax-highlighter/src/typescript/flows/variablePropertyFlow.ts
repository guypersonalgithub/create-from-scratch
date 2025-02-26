import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";

type VariablePropertyFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const variablePropertyFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
}: VariablePropertyFlowArgs) => {
  if (newTokenValue !== ".") {
    return;
  }

  tokens.push({ type: TokenTypes.OPERATOR, value: newTokenValue });
  previousTokensSummary.push(TokenTypes.OPERATOR);

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
