import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken } from "../../types";

type ThisFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const thisFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
}: ThisFlowArgs) => {
  if (newTokenValue !== "this") {
    return;
  }

  tokens.push({ type: TokenTypes.THIS, value: newTokenValue });
  previousTokensSummary.push(TokenTypes.THIS);

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
