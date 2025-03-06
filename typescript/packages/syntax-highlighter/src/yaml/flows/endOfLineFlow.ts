import { TokenTypes } from "../constants";
import { BaseToken } from "../types";

type EndOfLineFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
};

export const endOfLineFlow = ({ tokens, newTokenValue, currentIndex }: EndOfLineFlowArgs) => {
  if (newTokenValue !== "\n") {
    return;
  }

  tokens.push({ type: TokenTypes.END_OF_LINE, value: newTokenValue });

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
