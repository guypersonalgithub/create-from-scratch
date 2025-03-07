import { TokenTypes } from "../constants";
import { BaseToken } from "../types";

type ArrayFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
};

export const arrayFlow = ({ tokens, newTokenValue, input, currentIndex }: ArrayFlowArgs) => {
  if (newTokenValue !== "[") {
    return;
  }

  tokens.push({ type: TokenTypes.ARRAY_SQUARE_BRACKET, value: newTokenValue });
};
