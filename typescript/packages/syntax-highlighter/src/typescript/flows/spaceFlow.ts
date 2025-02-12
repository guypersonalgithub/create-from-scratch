import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { findNextBreakpoint } from "../utils";

type SpaceFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const spaceFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: SpaceFlowArgs) => {
  const firstChar = newTokenValue.charAt(0);
  if (firstChar !== " " && firstChar !== "\n") {
    return;
  }

  let hasNewLine = false;

  let fullSpace = newTokenValue;

  if (newTokenValue === "\n") {
    hasNewLine = true;
  }

  while (
    (input[currentIndex] === " " || input[currentIndex] === "\n") &&
    currentIndex < input.length
  ) {
    const current = input[currentIndex];
    if (current === "\n") {
      hasNewLine = true;
    }

    fullSpace += current;
    currentIndex++;
  }

  tokens.push({
    type: TokenTypes.WHITESPACE,
    value: fullSpace,
  });

  if (hasNewLine) {
    previousTokensSummary.push(TokenTypes.WHITESPACE);
  }

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};

type SpaceFollowUpFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const spaceFollowUpFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
}: SpaceFollowUpFlowArgs) => {
  const breakpoint = findNextBreakpoint({ input, currentIndex });
  const potentialSpace = spaceFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  let followUpBreakpoint = breakpoint;
  if (potentialSpace) {
    followUpBreakpoint = findNextBreakpoint({ input, currentIndex: potentialSpace.updatedIndex });
  }

  return {
    breakpoint: followUpBreakpoint,
    space: potentialSpace,
  };
};
