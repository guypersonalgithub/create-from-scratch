import { breakpoints } from "./constants";
import { getNextNonSpaceCharIndex } from "@packages/string-utils";
import { spaceFlow } from "./spaceFlow";

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

  if (shouldBreak({ currentChar })) {
    return {
      updatedIndex: currentIndex,
      newTokenValue,
    };
  }

  while (currentIndex < input.length) {
    const currentChar = input[currentIndex];
    if (shouldBreak({ currentChar })) {
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

type ShouldBreakArgs = {
  currentChar: string;
};

export const shouldBreak = ({ currentChar }: ShouldBreakArgs) => {
  return breakpoints.has(currentChar);
};

type SpaceCallbackArgs = {
  input: string;
  currentIndex: number;
};

type ReturnType =
  | {
      skipped?: never;
      updatedIndex: number;
      newTokenValue: string;
    }
  | {
      skipped: string;
      updatedIndex: number;
      newTokenValue: string;
    };

export const spaceCallback = ({ input, currentIndex }: SpaceCallbackArgs): ReturnType => {
  const breakpoint = findNextBreakpoint({ input, currentIndex });
  const space = spaceFlow({
    input,
    newTokenValue: breakpoint.newTokenValue,
    currentIndex: breakpoint.updatedIndex,
  });

  return space
    ? {
        ...findNextBreakpoint({ input, currentIndex: space.updatedIndex }),
        skipped: input.slice(currentIndex, space.updatedIndex),
      }
    : breakpoint;
};

type IsntVariableNameArgs = {
  firstChar: string;
};

export const isntVariableName = ({ firstChar }: IsntVariableNameArgs) => {
  const first = firstChar[0];

  return (
    (shouldBreak({
      currentChar: first,
    }) &&
      first !== "_") ||
    first === " "
  );
};
