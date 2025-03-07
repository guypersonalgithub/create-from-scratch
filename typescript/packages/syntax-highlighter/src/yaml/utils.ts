import { getNextNonSpaceCharIndex } from "@packages/utils";
import { BaseToken } from "./types";
import { TokenTypes } from "./constants";

type FindNextBreakpointArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
};

export const findNextBreakpoint = ({ tokens, input, currentIndex }: FindNextBreakpointArgs) => {
  const { skippedIndexes } = getNextNonSpaceCharIndex({ input });
  if (skippedIndexes) {
    return {
      currentIndex: currentIndex + skippedIndexes,
      identation: skippedIndexes,
      newTokenValue: input.slice(currentIndex, skippedIndexes),
    };
  }

  const lastToken = tokens.length > 0 ? tokens[tokens.length - 1] : undefined;
  if (lastToken?.type === TokenTypes.END_OF_LINE) {
    
  }
};
