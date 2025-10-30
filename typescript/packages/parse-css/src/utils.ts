import {
  getNextNonSpaceCharIndex,
  isCharacterLetter,
  isCharacterNumber,
  isStringOnlyWithLetters,
} from "@packages/string-utils";
import { spaceFlow } from "./flows/spaceFlow";
import type { Callback } from "./types";

type FindNextBreakpointArgs = {
  input: string;
  currentIndex: number;
};

export const findNextBreakpoint = ({ input, currentIndex }: FindNextBreakpointArgs) => {
  // Consider adding a case where input.length === currentIndex.
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

  if (isCharacterNumber({ currentChar })) {
    return {
      updatedIndex: currentIndex,
      newTokenValue,
      isNumeric: true,
    };
  }

  if (!isCharacterLetter({ currentChar })) {
    return {
      updatedIndex: currentIndex,
      newTokenValue,
    };
  }

  while (currentIndex < input.length) {
    const currentChar = input[currentIndex];
    if (!isCharacterLetter({ currentChar })) {
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

type Return = ReturnType<typeof findNextBreakpoint> & { skipped?: string };

export const spaceCallback = ({ input, currentIndex }: SpaceCallbackArgs): Return => {
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

export const getFullValue = ({
  newTokenValue,
  input,
  currentIndex,
}: Omit<Callback, "tokens" | "extensionParsing">) => {
  let value = newTokenValue;
  let followup = spaceCallback({ input, currentIndex });

  while (
    followup.updatedIndex < input.length &&
    (isStringOnlyWithLetters({ str: followup.newTokenValue }) || followup.newTokenValue === "-") &&
    !followup.skipped
  ) {
    value += followup.newTokenValue;
    currentIndex = followup.updatedIndex;
    followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
  }

  const legitimateValue = !value.endsWith("-");

  return { value, currentIndex, legitimateValue, followup };
};
