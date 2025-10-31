import { getNextNonSpaceCharIndex, isAlphaNumeric } from "@packages/string-utils";
import { spaceFlow } from "./spaceFlow";
import { commentFlow } from "./commentFlow";

type FindNextBreakpointArgs = {
  input: string;
  currentIndex: number;
};

export const findNextBreakpoint = ({ input, currentIndex }: FindNextBreakpointArgs) => {
  const { skippedIndexes } = getNextNonSpaceCharIndex({ input: input.slice(currentIndex) });
  if (skippedIndexes) {
    return {
      updatedIndex: currentIndex + skippedIndexes,
      newTokenValue: input.slice(currentIndex, currentIndex + skippedIndexes),
    };
  }

  const currentChar = input[currentIndex];
  let newTokenValue = currentChar;
  currentIndex++;

  if (!isAlphaNumeric({ str: currentChar })) {
    return {
      updatedIndex: currentIndex,
      newTokenValue,
    };
  }

  while (currentIndex < input.length) {
    const currentChar = input[currentIndex];
    if (!isAlphaNumeric({ str: currentChar })) {
      return {
        updatedIndex: currentIndex,
        newTokenValue,
      };
    }

    newTokenValue += currentChar;
    currentIndex++;
  }

  return {
    updatedIndex: currentIndex,
    newTokenValue,
  };
};

type SpaceCallbackArgs = {
  input: string;
  currentIndex: number;
};

export const spaceCallback = ({ input, currentIndex }: SpaceCallbackArgs) => {
  const breakpoint = findNextBreakpoint({ input, currentIndex });
  const space = spaceFlow({
    input,
    newTokenValue: breakpoint.newTokenValue,
    currentIndex: breakpoint.updatedIndex,
  });

  if (space) {
    const followup = findNextBreakpoint({ input, currentIndex: space.updatedIndex });
    const comment = commentFlow({
      input,
      currentIndex: followup.updatedIndex,
      newTokenValue: followup.newTokenValue,
    });

    if (comment) {
      return findNextBreakpoint({ input, currentIndex: comment.updatedIndex });
    }

    return followup;
  }

  const comment = commentFlow({
    input,
    currentIndex: breakpoint.updatedIndex,
    newTokenValue: breakpoint.newTokenValue,
  });

  if (comment) {
    return findNextBreakpoint({ input, currentIndex: comment.updatedIndex });
  }

  return breakpoint;
};
