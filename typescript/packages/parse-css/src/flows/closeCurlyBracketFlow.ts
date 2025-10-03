import { TokenTypes } from "../constants";
import type { Callback } from "../types";

export const closeCurlyBracketFlow = ({
  tokens,
  newTokenValue,
//   input,
  currentIndex,
  // extensionParsing,
}: Callback) => {
  if (newTokenValue !== "}") {
    return;
  }

  tokens.push({
    type: TokenTypes.CLOSE_CURLY_BRACKET,
    value: newTokenValue,
    startIndex: currentIndex - newTokenValue.length,
    endIndex: currentIndex,
  });

  return { updatedIndex: currentIndex };
};
