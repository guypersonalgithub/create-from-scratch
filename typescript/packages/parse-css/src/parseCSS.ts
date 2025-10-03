import { TokenTypes } from "./constants";
import { tokenizerFlows } from "./flows/tokenizerFlows";
import type { BaseToken } from "./types";
import { spaceCallback } from "./utils";

type ParseCSSArgs = {
  input: string;
  cssInJS?: boolean;
  extensionParsing?: boolean;
};

export const parseCSS = ({ input, cssInJS, extensionParsing }: ParseCSSArgs) => {
  const tokens: BaseToken[] = [];
  let currentIndex = 0;

  while (currentIndex < input.length) {
    const { updatedIndex, newTokenValue, skipped } = spaceCallback({ input, currentIndex });
    if (!extensionParsing && skipped) {
      tokens.push({
        type: TokenTypes.WHITESPACE,
        value: skipped,
        startIndex: currentIndex,
        endIndex: currentIndex + skipped.length,
      });
    }

    if (!newTokenValue) {
      break;
    }

    const { updatedIndex: newIndex } = tokenizerFlows({
      tokens,
      newTokenValue,
      input,
      currentIndex: updatedIndex,
      cssInJS,
      extensionParsing,
    });

    currentIndex = newIndex;
  }

  return { tokens };
};
