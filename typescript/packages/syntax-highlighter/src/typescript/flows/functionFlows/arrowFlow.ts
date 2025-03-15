import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";

type ArrowFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const arrowFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: ArrowFlowArgs) => {
  const nextChar = input[currentIndex];
  if (newTokenValue !== "=" || nextChar !== ">") {
    return;
  }

  currentIndex++;

  tokens.push({ type: TokenTypes.ARROW, value: newTokenValue + nextChar });
  previousTokensSummary.push(TokenTypes.ARROW);

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
