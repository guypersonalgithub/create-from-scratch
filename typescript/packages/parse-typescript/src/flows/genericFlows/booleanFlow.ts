import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken } from "../../types";

type BooleanFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const booleanFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
}: BooleanFlowArgs) => {
  if (newTokenValue !== "true" && newTokenValue !== "false") {
    return;
  }

  tokens.push({ type: TokenTypes.BOOLEAN, value: newTokenValue });
  previousTokensSummary.push(TokenTypes.BOOLEAN);

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
