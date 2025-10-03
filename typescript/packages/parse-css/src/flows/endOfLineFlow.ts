import { TokenTypes } from "../constants";
import type { Callback } from "../types";

export const endOfLineFlow = ({ newTokenValue, currentIndex, tokens }: Callback) => {
  if (newTokenValue !== ";") {
    return;
  }

  tokens.push({
    type: TokenTypes.END_OF_LINE,
    value: newTokenValue,
    startIndex: currentIndex - newTokenValue.length,
    endIndex: currentIndex,
  });

  return { updatedIndex: currentIndex };
};
