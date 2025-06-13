import { getNextNonSpaceCharIndex } from "@packages/utils";
import { TokenTypes } from "../constants";
import { type BaseToken } from "../types";

type SpaceFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
};

export const spaceFlow = ({ tokens, input, currentIndex }: SpaceFlowArgs) => {
  const remainingInput = input.slice(currentIndex);
  const { skippedIndexes = 0 } = getNextNonSpaceCharIndex({ input: remainingInput });
  if (skippedIndexes === 0) {
    return;
  }

  const value = remainingInput.slice(0, skippedIndexes);

  tokens.push({
    type: TokenTypes.WHITESPACE,
    value,
  });

  return {
    updatedIndex: currentIndex + skippedIndexes,
    identation: skippedIndexes,
    stop: false,
  };
};
