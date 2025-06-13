import { TokenTypes } from "../constants";
import { type BaseToken } from "../types";

type ObjectFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
};

export const objectFlow = ({ tokens, newTokenValue, input, currentIndex }: ObjectFlowArgs) => {
  if (newTokenValue !== "{") {
    return;
  }

  tokens.push({ type: TokenTypes.OBJECT_CURLY_BRACKET, value: newTokenValue });
};
