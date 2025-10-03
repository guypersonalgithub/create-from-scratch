import { TokenTypes } from "../constants";
import type { Callback } from "../types";
import { spaceCallback } from "../utils";
import { propertyFlow } from "./propertyFlow";

export const atParenthesisFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  extensionParsing,
  cssInJS,
}: Callback) => {
  const isOpenParenthesis = newTokenValue === "(";
  if (!isOpenParenthesis && newTokenValue !== ")") {
    return;
  }

  if (isOpenParenthesis) {
    tokens.push({
      type: TokenTypes.AT_OPEN_PARENTHESIS,
      value: newTokenValue,
      startIndex: currentIndex - 1,
      endIndex: currentIndex,
    });

    const followup = spaceCallback({ input, currentIndex: currentIndex });

    const property = propertyFlow({
      tokens,
      newTokenValue: followup.newTokenValue,
      input,
      currentIndex: followup.updatedIndex,
      extensionParsing,
      cssInJS,
      stopAtValue: ")",
      withinAtRuleDeclaration: true,
    });

    if (property) {
      currentIndex = property.updatedIndex;
    }

    return { updatedIndex: currentIndex, isOpen: true };
  }

  tokens.push({
    type: TokenTypes.AT_CLOSE_PARENTHESIS,
    value: newTokenValue,
    startIndex: currentIndex - 1,
    endIndex: currentIndex,
  });

  return { updatedIndex: currentIndex, isOpen: false };
};
