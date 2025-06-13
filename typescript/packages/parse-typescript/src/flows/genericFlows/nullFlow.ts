import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken } from "../../types";

type NullFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const nullFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
}: NullFlowArgs) => {
  if (newTokenValue !== "null") {
    return;
  }

  tokens.push({
    type: TokenTypes.NULL,
    value: newTokenValue,
  });

  previousTokensSummary.push(TokenTypes.NULL);

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
